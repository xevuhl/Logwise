import { useState, useMemo, useRef, useEffect } from 'react';
import {
  GitMerge,
  Plus,
  Search,
  ArrowRight,
  X,
  Edit2,
  Trash2,
  Save,
  AlertTriangle,
  Network,
  Database,
  Target,
  Link2,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { relationshipTypes, statusOptions, targetTypes, targetStatusOptions } from '../constants';

function Relationships({ sources, targets, relationships, onCreate, onUpdate, onDelete }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Create a map of sources for quick lookup
  const sourcesMap = useMemo(() => {
    const map = {};
    sources.forEach(s => { map[s.id] = { ...s, entityType: 'source' }; });
    return map;
  }, [sources]);

  // Create a map of targets for quick lookup
  const targetsMap = useMemo(() => {
    const map = {};
    (targets || []).forEach(t => { map[t.id] = { ...t, entityType: 'target' }; });
    return map;
  }, [targets]);

  // Filter relationships
  const filteredRelationships = useMemo(() => {
    return relationships.filter(rel => {
      // Handle both source types (log source or target as source for chained flows)
      const sourceEntity = rel.sourceType === 'target' ? targetsMap[rel.sourceId] : sourcesMap[rel.sourceId];
      const targetEntity = rel.targetType === 'target' ? targetsMap[rel.targetId] : sourcesMap[rel.targetId];
      
      const matchesSearch = !search || 
        sourceEntity?.name?.toLowerCase().includes(search.toLowerCase()) ||
        targetEntity?.name?.toLowerCase().includes(search.toLowerCase()) ||
        rel.description?.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = typeFilter === 'all' || rel.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [relationships, sourcesMap, targetsMap, search, typeFilter]);

  // Group relationships by source (only log sources, not target-to-target)
  const relationshipsBySource = useMemo(() => {
    const grouped = {};
    sources.forEach(source => {
      // Outgoing: relationships where this source is the origin (and sourceType is 'source' or undefined)
      const outgoing = relationships.filter(r => r.sourceId === source.id && (!r.sourceType || r.sourceType === 'source'));
      // Incoming: relationships where this source is the destination (targetType must be 'source' or undefined)
      const incoming = relationships.filter(r => r.targetId === source.id && (!r.targetType || r.targetType === 'source'));
      if (outgoing.length > 0 || incoming.length > 0) {
        grouped[source.id] = {
          source,
          outgoing,
          incoming
        };
      }
    });
    return grouped;
  }, [sources, relationships]);

  // Group relationships by target (ingestion destinations) - includes both incoming and outgoing for chained flows
  const relationshipsByTarget = useMemo(() => {
    const grouped = {};
    
    (targets || []).forEach(target => {
      // Incoming: relationships where this target is the destination
      const incoming = relationships.filter(r => r.targetId === target.id && r.targetType === 'target');
      // Outgoing: relationships where this target is the source (for chained flows like Cribl → ADX)
      const outgoing = relationships.filter(r => r.sourceId === target.id && r.sourceType === 'target');
      
      if (incoming.length > 0 || outgoing.length > 0) {
        grouped[target.id] = {
          target,
          incoming,
          outgoing
        };
      }
    });
    return grouped;
  }, [targets, relationships]);

  // Count relationships to targets
  const targetRelationshipsCount = useMemo(() => {
    return relationships.filter(r => r.targetType === 'target').length;
  }, [relationships]);

  const getTypeColor = (type) => {
    const relType = relationshipTypes.find(t => t.value === type);
    return relType?.color || 'gray';
  };

  const getStatusColor = (status) => {
    const opt = statusOptions.find(s => s.value === status);
    return opt?.color || 'gray';
  };

  const getTargetStatusColor = (status) => {
    const opt = targetStatusOptions.find(s => s.value === status);
    return opt?.color || 'gray';
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <GitMerge className="h-5 w-5 text-indigo-500" />
            Relationship Mapping
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Map data flows and dependencies between log sources
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs btn-gradient text-white rounded"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Relationship
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[180px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search relationships..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Types</option>
          {relationshipTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          title="Total Relationships"
          value={relationships.length}
          subtitle={`${targetRelationshipsCount} to targets`}
          icon={GitMerge}
          color="indigo"
        />
        <StatCard
          title="Connected Sources"
          value={Object.keys(relationshipsBySource).length}
          subtitle={`of ${sources.length} sources`}
          icon={Link2}
          color="green"
        />
        <StatCard
          title="Isolated Sources"
          value={sources.length - Object.keys(relationshipsBySource).length}
          subtitle={sources.length - Object.keys(relationshipsBySource).length > 0 ? 'need connections' : 'all connected'}
          icon={AlertCircle}
          color={sources.length - Object.keys(relationshipsBySource).length > 0 ? 'yellow' : 'green'}
        />
        <StatCard
          title="Active Targets"
          value={Object.keys(relationshipsByTarget).length}
          subtitle={`of ${(targets || []).length} targets`}
          icon={Target}
          color="purple"
        />
      </div>

      {/* Interactive Graph View */}
      <InteractiveGraph
        sources={sources}
        targets={targets}
        relationships={relationships}
        sourcesMap={sourcesMap}
        targetsMap={targetsMap}
        getTypeColor={getTypeColor}
        getStatusColor={getStatusColor}
        getTargetStatusColor={getTargetStatusColor}
        onEdit={setEditingRelationship}
        onDelete={setDeleteConfirm}
        onAddRelationship={() => setShowAddModal(true)}
      />

      {/* Add/Edit Modal */}
      {(showAddModal || editingRelationship) && (
        <RelationshipModal
          relationship={editingRelationship}
          sources={sources}
          targets={targets}
          onClose={() => {
            setShowAddModal(false);
            setEditingRelationship(null);
          }}
          onSave={async (data) => {
            if (editingRelationship) {
              await onUpdate(editingRelationship.id, data);
            } else {
              await onCreate(data);
            }
            setShowAddModal(false);
            setEditingRelationship(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <DeleteConfirmModal
          relationship={deleteConfirm}
          sourcesMap={sourcesMap}
          targetsMap={targetsMap}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={async () => {
            await onDelete(deleteConfirm.id);
            setDeleteConfirm(null);
          }}
        />
      )}
    </div>
  );
}

// InteractiveGraph component - SVG-based network visualization
function InteractiveGraph({
  sources,
  targets,
  relationships,
  sourcesMap,
  targetsMap,
  getTypeColor,
  getStatusColor,
  getTargetStatusColor,
  onEdit,
  onDelete,
  onAddRelationship
}) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [selectedRelationship, setSelectedRelationship] = useState(null);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: Math.max(width, 600), height: Math.max(height, 400) });
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Calculate node positions
  const nodePositions = useMemo(() => {
    const positions = {};
    const padding = 80;
    const nodeHeight = 50;
    const minSpacing = 80; // Minimum vertical spacing between nodes
    const leftX = padding + 80;
    const midX = dimensions.width / 2;
    const rightX = dimensions.width - padding - 80;
    
    // Get sources and targets that have relationships
    const connectedSourceIds = new Set();
    const connectedTargetIds = new Set();
    // Track targets that act as intermediate nodes (both receive and send data)
    const intermediateTargetIds = new Set();
    // Track targets that only receive (final destinations)
    const finalTargetIds = new Set();
    
    relationships.forEach(rel => {
      if (!rel.sourceType || rel.sourceType === 'source') {
        connectedSourceIds.add(rel.sourceId);
      }
      if (rel.sourceType === 'target') {
        // This target is a source for another relationship (intermediate)
        intermediateTargetIds.add(rel.sourceId);
      }
      if (rel.targetType === 'target') {
        connectedTargetIds.add(rel.targetId);
      }
    });

    // Determine which targets are final destinations (receive but don't send)
    connectedTargetIds.forEach(id => {
      if (!intermediateTargetIds.has(id)) {
        finalTargetIds.add(id);
      }
    });

    // Position sources on the left with better spacing
    const sourcesToShow = sources.filter(s => connectedSourceIds.has(s.id));
    const sourceSpacing = Math.max(minSpacing, (dimensions.height - 2 * padding) / Math.max(sourcesToShow.length, 1));
    const sourceStartY = padding + (dimensions.height - 2 * padding - (sourcesToShow.length - 1) * sourceSpacing) / 2;
    
    sourcesToShow.forEach((source, i) => {
      positions[`source-${source.id}`] = {
        x: leftX,
        y: sourceStartY + i * sourceSpacing,
        type: 'source',
        entity: source,
        index: i
      };
    });

    // Position intermediate targets in the middle (targets that feed other targets)
    const intermediateTargets = (targets || []).filter(t => intermediateTargetIds.has(t.id));
    const intermediateSpacing = Math.max(minSpacing, (dimensions.height - 2 * padding) / Math.max(intermediateTargets.length, 1));
    const intermediateStartY = padding + (dimensions.height - 2 * padding - (intermediateTargets.length - 1) * intermediateSpacing) / 2;
    
    intermediateTargets.forEach((target, i) => {
      positions[`target-${target.id}`] = {
        x: midX,
        y: intermediateStartY + i * intermediateSpacing,
        type: 'target',
        entity: target,
        isIntermediate: true,
        index: i
      };
    });

    // Position final targets on the right with better spacing
    const finalTargets = (targets || []).filter(t => finalTargetIds.has(t.id));
    const targetSpacing = Math.max(minSpacing, (dimensions.height - 2 * padding) / Math.max(finalTargets.length, 1));
    const targetStartY = padding + (dimensions.height - 2 * padding - (finalTargets.length - 1) * targetSpacing) / 2;
    
    finalTargets.forEach((target, i) => {
      positions[`target-${target.id}`] = {
        x: rightX,
        y: targetStartY + i * targetSpacing,
        type: 'target',
        entity: target,
        isIntermediate: false,
        index: i
      };
    });

    return positions;
  }, [sources, targets, relationships, dimensions]);

  // Calculate edges with indices for offsetting overlapping paths
  const edges = useMemo(() => {
    // Group edges by their target to calculate offsets
    const edgesByTarget = {};
    
    const rawEdges = relationships
      .filter(rel => rel.targetType === 'target')
      .map(rel => {
        // Handle both source-to-target and target-to-target relationships
        const sourceKey = rel.sourceType === 'target' 
          ? `target-${rel.sourceId}` 
          : `source-${rel.sourceId}`;
        const targetKey = `target-${rel.targetId}`;
        const source = nodePositions[sourceKey];
        const target = nodePositions[targetKey];
        
        if (!source || !target) return null;
        
        // Determine if this is a target-to-target edge
        const isTargetToTarget = rel.sourceType === 'target';
        
        // Track edges going to the same target for offset calculation
        if (!edgesByTarget[targetKey]) {
          edgesByTarget[targetKey] = [];
        }
        const edgeIndex = edgesByTarget[targetKey].length;
        edgesByTarget[targetKey].push(rel.id);
        
        return {
          id: rel.id,
          relationship: rel,
          x1: source.x + 80,
          y1: source.y,
          x2: target.x - 80,
          y2: target.y,
          sourceY: source.y,
          targetY: target.y,
          type: rel.type,
          color: getTypeColor(rel.type),
          isTargetToTarget,
          edgeIndex,
          targetKey
        };
      })
      .filter(Boolean);
    
    // Add total count for each target to calculate proper offsets
    return rawEdges.map(edge => ({
      ...edge,
      totalEdgesToTarget: edgesByTarget[edge.targetKey].length
    }));
  }, [relationships, nodePositions, getTypeColor]);

  // Color mapping for edges
  const getEdgeColor = (color) => {
    const colors = {
      blue: '#3b82f6',
      purple: '#8b5cf6',
      orange: '#f97316',
      red: '#ef4444',
      green: '#22c55e',
      cyan: '#06b6d4',
      indigo: '#6366f1',
      gray: '#6b7280'
    };
    return colors[color] || colors.gray;
  };

  // Status color mapping
  const getNodeStatusColor = (status, isTarget) => {
    const colors = {
      active: '#22c55e',
      inactive: '#6b7280',
      testing: '#f59e0b',
      planned: '#3b82f6',
      deprecated: '#ef4444',
      online: '#22c55e',
      offline: '#ef4444',
      degraded: '#f59e0b',
      maintenance: '#3b82f6'
    };
    return colors[status] || '#6b7280';
  };

  // Handle pan/zoom
  const handleMouseDown = (e) => {
    if (e.target === svgRef.current || e.target.classList.contains('graph-bg')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.min(Math.max(z * delta, 0.5), 2));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Generate curved path for edges that avoids crossing through nodes
  const getEdgePath = (edge) => {
    const dx = edge.x2 - edge.x1;
    const dy = edge.y2 - edge.y1;
    
    // Calculate offset for multiple edges to same target
    const offsetMultiplier = edge.edgeIndex - (edge.totalEdgesToTarget - 1) / 2;
    const verticalOffset = offsetMultiplier * 15; // 15px offset per edge
    
    // Determine curve direction based on source/target Y positions
    // This helps routes avoid crossing through intermediate nodes
    const curveDirection = dy > 0 ? 1 : dy < 0 ? -1 : (edge.edgeIndex % 2 === 0 ? 1 : -1);
    
    // For edges with significant vertical difference, use a more pronounced curve
    const yDiff = Math.abs(dy);
    const curveFactor = Math.min(yDiff * 0.3, 80) + Math.abs(verticalOffset);
    
    // Control point offsets - horizontal spread and vertical curve
    const controlOffsetX = Math.min(Math.abs(dx) * 0.35, 120);
    
    // Calculate midpoint with vertical offset to avoid nodes
    const midX = (edge.x1 + edge.x2) / 2;
    const midY = (edge.y1 + edge.y2) / 2 + verticalOffset;
    
    // For edges going to different Y levels, curve away from center
    if (yDiff > 30) {
      // Use quadratic bezier through an offset midpoint for cleaner routing
      const curveY = midY + (curveDirection * curveFactor * 0.5);
      return `M ${edge.x1} ${edge.y1} Q ${midX} ${curveY}, ${edge.x2} ${edge.y2}`;
    }
    
    // For relatively horizontal edges, use simple cubic bezier with offset
    const cp1y = edge.y1 + verticalOffset;
    const cp2y = edge.y2 + verticalOffset;
    return `M ${edge.x1} ${edge.y1} C ${edge.x1 + controlOffsetX} ${cp1y}, ${edge.x2 - controlOffsetX} ${cp2y}, ${edge.x2} ${edge.y2}`;
  };

  if (Object.keys(nodePositions).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-8 text-center">
        <Network className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <div className="text-gray-400 dark:text-gray-500 text-sm">No relationships to display</div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Create relationships from sources to targets to visualize the data flow
        </p>
        <button
          onClick={onAddRelationship}
          className="mt-4 px-4 py-2 text-xs btn-gradient text-white rounded inline-flex items-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add First Relationship
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Data Flow Graph
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            ({Object.keys(nodePositions).length} nodes, {edges.length} connections)
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom(z => Math.min(z * 1.2, 2))}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z * 0.8, 0.5))}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            title="Reset View"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <span className="text-xs text-gray-400 ml-2">{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* Graph Canvas */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: '600px', cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Legend */}
        <div className="absolute top-2 left-2 z-10 bg-white/90 dark:bg-gray-800/90 rounded border border-gray-200 dark:border-gray-600 p-2 text-xs">
          <div className="font-medium text-gray-700 dark:text-gray-300 mb-1.5">Legend</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Log Source</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500/20 border border-orange-500 border-dashed"></div>
              <span className="text-gray-600 dark:text-gray-400">Intermediate Target</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500/20 border border-purple-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Final Destination</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-gray-200 dark:border-gray-600">
              <div className="w-4 h-0.5 bg-blue-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Source → Target</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-blue-500" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #3b82f6, #3b82f6 4px, transparent 4px, transparent 6px)' }}></div>
              <span className="text-gray-600 dark:text-gray-400">Target → Target</span>
            </div>
          </div>
        </div>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="select-none"
        >
          <defs>
            {/* Arrow markers for each color */}
            {['blue', 'purple', 'orange', 'red', 'green', 'cyan', 'indigo', 'gray'].map(color => (
              <marker
                key={color}
                id={`arrow-${color}`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={getEdgeColor(color)} />
              </marker>
            ))}
          </defs>

          {/* Background */}
          <rect
            className="graph-bg"
            width="100%"
            height="100%"
            fill="transparent"
          />

          {/* Transform group for pan/zoom */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Grid pattern */}
            <g className="opacity-10">
              {Array.from({ length: Math.ceil(dimensions.width / 50) }, (_, i) => (
                <line
                  key={`v-${i}`}
                  x1={i * 50}
                  y1={0}
                  x2={i * 50}
                  y2={dimensions.height}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-gray-400 dark:text-gray-600"
                />
              ))}
              {Array.from({ length: Math.ceil(dimensions.height / 50) }, (_, i) => (
                <line
                  key={`h-${i}`}
                  x1={0}
                  y1={i * 50}
                  x2={dimensions.width}
                  y2={i * 50}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-gray-400 dark:text-gray-600"
                />
              ))}
            </g>

            {/* Edges */}
            {edges.map(edge => (
              <g key={edge.id}>
                {/* Edge path */}
                <path
                  d={getEdgePath(edge)}
                  fill="none"
                  stroke={hoveredEdge === edge.id ? getEdgeColor(edge.color) : getEdgeColor(edge.color)}
                  strokeWidth={hoveredEdge === edge.id || selectedRelationship?.id === edge.id ? 3 : 2}
                  strokeOpacity={hoveredEdge === edge.id || selectedRelationship?.id === edge.id ? 1 : 0.6}
                  strokeDasharray={edge.isTargetToTarget ? '8,4' : 'none'}
                  markerEnd={`url(#arrow-${edge.color})`}
                  className="transition-all duration-200"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredEdge(edge.id)}
                  onMouseLeave={() => setHoveredEdge(null)}
                  onClick={() => setSelectedRelationship(edge.relationship)}
                />
                {/* Target-to-target label */}
                {edge.isTargetToTarget && (
                  <text
                    x={(edge.x1 + edge.x2) / 2}
                    y={(edge.y1 + edge.y2) / 2 - 10}
                    textAnchor="middle"
                    fill={getEdgeColor(edge.color)}
                    fontSize="9"
                    fontWeight="500"
                    className="pointer-events-none"
                  >
                    Target → Target
                  </text>
                )}
                {/* Invisible wider path for easier hovering */}
                <path
                  d={getEdgePath(edge)}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="15"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredEdge(edge.id)}
                  onMouseLeave={() => setHoveredEdge(null)}
                  onClick={() => setSelectedRelationship(edge.relationship)}
                />
              </g>
            ))}

            {/* Nodes */}
            {Object.entries(nodePositions).map(([key, pos]) => {
              const isSource = pos.type === 'source';
              const isIntermediate = pos.isIntermediate;
              const statusColor = getNodeStatusColor(pos.entity.status, !isSource);
              const isHovered = hoveredNode === key;
              
              // Color scheme: sources = blue, intermediate targets = orange, final targets = purple
              const nodeColor = isSource ? '#1e40af' : (isIntermediate ? '#ea580c' : '#7c3aed');
              const strokeColor = isSource ? '#3b82f6' : (isIntermediate ? '#f97316' : '#8b5cf6');
              
              return (
                <g
                  key={key}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onMouseEnter={() => setHoveredNode(key)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: 'default' }}
                >
                  {/* Node background */}
                  <rect
                    x={-80}
                    y={-20}
                    width={160}
                    height={40}
                    rx={8}
                    fill={nodeColor}
                    fillOpacity={isHovered ? 0.2 : 0.1}
                    stroke={strokeColor}
                    strokeWidth={isHovered ? 2 : 1}
                    strokeDasharray={isIntermediate ? '4,2' : 'none'}
                    className="transition-all duration-200"
                  />
                  
                  {/* Status indicator */}
                  <circle
                    cx={-65}
                    cy={0}
                    r={5}
                    fill={statusColor}
                  />
                  
                  {/* Icon */}
                  {isSource ? (
                    <g transform="translate(-52, -6)" fill="none" stroke="#3b82f6" strokeWidth="1.5">
                      <ellipse cx="6" cy="4" rx="5" ry="2" />
                      <path d="M1 4v4c0 1.1 2.2 2 5 2s5-.9 5-2V4" />
                      <path d="M1 8v4c0 1.1 2.2 2 5 2s5-.9 5-2V8" />
                    </g>
                  ) : isIntermediate ? (
                    <g transform="translate(-52, -6)" fill="none" stroke="#f97316" strokeWidth="1.5">
                      {/* Router/collector icon for intermediate targets */}
                      <rect x="1" y="3" width="10" height="6" rx="1" />
                      <circle cx="4" cy="6" r="1" fill="#f97316" />
                      <circle cx="8" cy="6" r="1" fill="#f97316" />
                      <path d="M6 0v3M6 9v3M0 6h1M11 6h1" />
                    </g>
                  ) : (
                    <g transform="translate(-52, -6)" fill="none" stroke="#8b5cf6" strokeWidth="1.5">
                      <circle cx="6" cy="6" r="5" />
                      <circle cx="6" cy="6" r="2" />
                      <path d="M6 1v2M6 9v2M11 6h-2M3 6H1" />
                    </g>
                  )}
                  
                  {/* Node label */}
                  <text
                    x={-35}
                    y={0}
                    dominantBaseline="middle"
                    className="text-xs font-medium"
                    fill={isSource ? '#3b82f6' : '#8b5cf6'}
                    style={{ fontSize: '11px' }}
                  >
                    {pos.entity.name.length > 16 ? pos.entity.name.slice(0, 14) + '...' : pos.entity.name}
                  </text>
                  
                  {/* Subtitle */}
                  <text
                    x={-35}
                    y={12}
                    dominantBaseline="middle"
                    className="text-[9px]"
                    fill="#9ca3af"
                  >
                    {isSource ? pos.entity.category : targetTypes.find(t => t.value === pos.entity.type)?.label || pos.entity.type}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hover tooltip for edges */}
        {hoveredEdge && (
          <div
            className="absolute pointer-events-none bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg z-10"
            style={{ top: 10, right: 10 }}
          >
            {(() => {
              const edge = edges.find(e => e.id === hoveredEdge);
              if (!edge) return null;
              const relType = relationshipTypes.find(t => t.value === edge.type);
              const source = sourcesMap[edge.relationship.sourceId];
              const target = targetsMap[edge.relationship.targetId];
              return (
                <div>
                  <div className="font-medium">{relType?.label || edge.type}</div>
                  <div className="text-gray-400">{source?.name} → {target?.name}</div>
                  {edge.relationship.description && (
                    <div className="text-gray-400 mt-1">{edge.relationship.description}</div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Selected relationship panel */}
        {selectedRelationship && (
          <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`px-2 py-1 rounded text-xs font-medium bg-${getTypeColor(selectedRelationship.type)}-100 dark:bg-${getTypeColor(selectedRelationship.type)}-900/30 text-${getTypeColor(selectedRelationship.type)}-700 dark:text-${getTypeColor(selectedRelationship.type)}-400`}>
                  {relationshipTypes.find(t => t.value === selectedRelationship.type)?.label}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {sourcesMap[selectedRelationship.sourceId]?.name}
                  </span>
                  <ArrowRight className="h-4 w-4 inline mx-2 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {targetsMap[selectedRelationship.targetId]?.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onEdit(selectedRelationship);
                    setSelectedRelationship(null);
                  }}
                  className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    onDelete(selectedRelationship);
                    setSelectedRelationship(null);
                  }}
                  className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedRelationship(null)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            {selectedRelationship.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{selectedRelationship.description}</p>
            )}
            {(selectedRelationship.dataFlow || selectedRelationship.protocol) && (
              <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                {selectedRelationship.dataFlow && <span>Flow: {selectedRelationship.dataFlow}</span>}
                {selectedRelationship.protocol && <span>Protocol: {selectedRelationship.protocol}</span>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">Log Sources</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-purple-500/20 border border-purple-500" />
            <span className="text-gray-600 dark:text-gray-400">Targets</span>
          </div>
          <div className="border-l border-gray-300 dark:border-gray-600 h-4 mx-1" />
          {relationshipTypes.slice(0, 4).map(type => (
            <div key={type.value} className="flex items-center gap-1.5">
              <div className="w-4 h-0.5" style={{ backgroundColor: getEdgeColor(type.color) }} />
              <span className="text-gray-600 dark:text-gray-400">{type.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RelationshipModal({ relationship, sources, targets, onClose, onSave }) {
  const [formData, setFormData] = useState(relationship || {
    sourceId: '',
    sourceType: 'source', // 'source' or 'target' (for chained flows)
    targetId: '',
    targetType: 'source', // 'source' or 'target'
    type: 'feeds',
    description: '',
    dataFlow: '',
    protocol: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Handle source selection (Log Source or intermediate Target)
  const handleSourceChange = (value) => {
    if (!value) {
      setFormData({ ...formData, sourceId: '', sourceType: 'source' });
      return;
    }
    const [type, id] = value.split(':');
    setFormData({ ...formData, sourceId: id, sourceType: type });
  };

  const getSourceValue = () => {
    if (!formData.sourceId) return '';
    return `${formData.sourceType || 'source'}:${formData.sourceId}`;
  };

  // Handle destination selection (combined source + target dropdown)
  const handleDestinationChange = (value) => {
    if (!value) {
      setFormData({ ...formData, targetId: '', targetType: 'source' });
      return;
    }
    const [type, id] = value.split(':');
    setFormData({ ...formData, targetId: id, targetType: type });
  };

  const getDestinationValue = () => {
    if (!formData.targetId) return '';
    return `${formData.targetType}:${formData.targetId}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.sourceId || !formData.targetId) {
      setError('Please select both source and destination');
      return;
    }
    
    // Check if source and destination are the same entity
    const sameType = (formData.sourceType || 'source') === formData.targetType;
    if (sameType && formData.sourceId === formData.targetId) {
      setError('Source and destination cannot be the same');
      return;
    }
    
    setSaving(true);
    try {
      await onSave(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {relationship ? 'Edit Relationship' : 'Add Relationship'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="flex items-center gap-1">
                  <Database className="h-3.5 w-3.5" />
                  Source *
                </span>
              </label>
              <select
                value={getSourceValue()}
                onChange={(e) => handleSourceChange(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select source...</option>
                {targets && targets.length > 0 && (
                  <optgroup label="🎯 Targets (for chained flows)">
                    {targets.filter(t => ['log-collector', 'log-aggregator', 'stream-processor'].includes(t.type)).map(target => {
                      const targetTypeInfo = targetTypes.find(tt => tt.value === target.type);
                      return (
                        <option key={`target:${target.id}`} value={`target:${target.id}`}>
                          {target.name} ({targetTypeInfo?.label || target.type})
                        </option>
                      );
                    })}
                  </optgroup>
                )}
                <optgroup label="📦 Log Sources">
                  {sources.map(source => (
                    <option key={`source:${source.id}`} value={`source:${source.id}`}>
                      {source.name} ({source.category})
                    </option>
                  ))}
                </optgroup>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Log Source or intermediate Target (e.g., Cribl)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Destination *
              </label>
              <select
                value={getDestinationValue()}
                onChange={(e) => handleDestinationChange(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select destination...</option>
                {targets && targets.length > 0 && (
                  <optgroup label="🎯 Targets (Ingestion Destinations)">
                    {targets.map(target => {
                      const targetTypeInfo = targetTypes.find(t => t.value === target.type);
                      return (
                        <option key={`target:${target.id}`} value={`target:${target.id}`}>
                          {target.name} ({targetTypeInfo?.label || target.type})
                        </option>
                      );
                    })}
                  </optgroup>
                )}
                <optgroup label="📦 Log Sources">
                  {sources.map(source => (
                    <option key={`source:${source.id}`} value={`source:${source.id}`}>
                      {source.name} ({source.category})
                    </option>
                  ))}
                </optgroup>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Select a Target (SIEM, data lake) or another Log Source
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Relationship Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {relationshipTypes.map(type => (
                <label
                  key={type.value}
                  className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all ${
                    formData.type === type.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="sr-only"
                  />
                  <div className={`w-1.5 h-1.5 rounded-full bg-${type.color}-500`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900 dark:text-white">{type.label}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Describe this relationship..."
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Flow / Port
              </label>
              <input
                type="text"
                value={formData.dataFlow || ''}
                onChange={(e) => setFormData({ ...formData, dataFlow: e.target.value })}
                placeholder="e.g., TCP/514, HTTPS/443"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Protocol / Format
              </label>
              <input
                type="text"
                value={formData.protocol || ''}
                onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                placeholder="e.g., Syslog, CEF, JSON"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm btn-gradient text-white rounded disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : relationship ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ relationship, sourcesMap, targetsMap, onClose, onConfirm }) {
  // Handle both source types (log source or target as source for chained flows)
  const isTargetSource = relationship.sourceType === 'target';
  const sourceEntity = isTargetSource 
    ? targetsMap[relationship.sourceId]
    : sourcesMap[relationship.sourceId];
  const isTargetDestination = relationship.targetType === 'target';
  const destination = isTargetDestination 
    ? targetsMap[relationship.targetId]
    : sourcesMap[relationship.targetId];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md animate-slide-in">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Relationship?
            </h3>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete the relationship between:
          </p>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded text-sm mb-4 flex items-center gap-2">
            {isTargetSource ? (
              <Target className="h-4 w-4 text-purple-500" />
            ) : (
              <Database className="h-4 w-4 text-blue-500" />
            )}
            <span className="font-medium text-gray-900 dark:text-white">{sourceEntity?.name || 'Unknown'}</span>
            <span className="mx-2 text-gray-400">→</span>
            {isTargetDestination ? (
              <Target className="h-4 w-4 text-purple-500" />
            ) : (
              <Database className="h-4 w-4 text-blue-500" />
            )}
            <span className="font-medium text-gray-900 dark:text-white">{destination?.name || 'Unknown'}</span>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// StatCard component for consistent styling
function StatCard({ title, value, subtitle, icon: Icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
    indigo: 'text-indigo-500',
    cyan: 'text-cyan-500',
    orange: 'text-orange-500',
  };

  const valueColorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    red: 'text-red-600 dark:text-red-400',
    purple: 'text-purple-600 dark:text-purple-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
    orange: 'text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`h-4 w-4 ${colorClasses[color]}`} />
        <span className="text-xs text-gray-500 dark:text-gray-400">{title}</span>
      </div>
      <div className={`text-2xl font-bold ${valueColorClasses[color]}`}>
        {value}
      </div>
      {subtitle && (
        <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
          {subtitle}
        </div>
      )}
    </div>
  );
}

export default Relationships;
