// // src/components/FamilyTreeView.jsx
// import { useRef, useEffect, useState } from 'react';
// import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

// const FamilyTreeView = ({ members, layout = 'horizontal' }) => {
//   const containerRef = useRef(null);
//   const [scale, setScale] = useState(1);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [isPanning, setIsPanning] = useState(false);
//   const [startPos, setStartPos] = useState({ x: 0, y: 0 });

//   const handleZoomIn = () => {
//     setScale((prev) => Math.min(prev + 0.1, 2));
//   };

//   const handleZoomOut = () => {
//     setScale((prev) => Math.max(prev - 0.1, 0.5));
//   };

//   const handleZoomReset = () => {
//     setScale(1);
//     setPosition({ x: 0, y: 0 });
//   };

//   const handleMouseDown = (e) => {
//     setIsPanning(true);
//     setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
//   };

//   const handleMouseMove = (e) => {
//     if (!isPanning) return;
//     setPosition({
//       x: e.clientX - startPos.x,
//       y: e.clientY - startPos.y,
//     });
//   };

//   const handleMouseUp = () => {
//     setIsPanning(false);
//   };

//   // Build tree structure from flat members list
//   const buildTree = (members) => {
//     if (!members || members.length === 0) return [];
    
//     // Find root members (those without parents)
//     const memberMap = {};
//     members.forEach(m => {
//       memberMap[m._id] = { ...m, children: [] };
//     });

//     const roots = [];
//     members.forEach(m => {
//       if (m.father || m.mother) {
//         // Add as child to parent if parent exists in map
//         const parentId = m.father?._id || m.mother?._id;
//         if (parentId && memberMap[parentId]) {
//           memberMap[parentId].children.push(memberMap[m._id]);
//         } else {
//           roots.push(memberMap[m._id]);
//         }
//       } else {
//         roots.push(memberMap[m._id]);
//       }
//     });

//     return roots;
//   };

//   const treeData = buildTree(members);

//   const renderNode = (node, level = 0) => {
//     if (!node) return null;

//     const isHorizontal = layout === 'horizontal';
//     const children = node.children || [];

//     return (
//       <div
//         key={node._id}
//         className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} items-center`}
//         style={{
//           marginLeft: isHorizontal ? `${level * 60}px` : 0,
//           marginTop: isHorizontal ? 0 : `${level * 60}px`,
//         }}
//       >
//         <div className="relative">
//           <div className="flex flex-col items-center">
//             <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary bg-white shadow-md">
//               {node.photo ? (
//                 <img src={node.photo} alt={node.name} className="w-full h-full object-cover" />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
//                   <span className="text-xs">No img</span>
//                 </div>
//               )}
//             </div>
//             <div className="mt-1 text-center">
//               <p className="text-sm font-medium text-gray-900">{node.name}</p>
//               <p className="text-xs text-gray-500">
//                 {node.generation ? `Gen ${node.generation}` : ''}
//                 {node.isAlive ? ' 🟢' : ' ⚫'}
//               </p>
//             </div>
//           </div>

//           {/* Connection lines to children */}
//           {children.length > 0 && (
//             <div className={`absolute ${isHorizontal ? 'left-full top-1/2' : 'top-full left-1/2'} 
//               ${isHorizontal ? 'w-12 h-0.5' : 'h-12 w-0.5'} bg-gray-300`}
//             />
//           )}
//         </div>

//         {/* Children */}
//         {children.length > 0 && (
//           <div className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} 
//             ${isHorizontal ? 'ml-4' : 'mt-4'}`}
//           >
//             {children.map((child) => (
//               <div key={child._id} className="relative">
//                 {/* Vertical line from parent to child */}
//                 <div className={`absolute ${isHorizontal ? 'left-0 top-0 h-full w-0.5' : 'top-0 left-1/2 h-0.5 w-full'} 
//                   bg-gray-300`}
//                 />
//                 {renderNode(child, level + 1)}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="relative">
//       {/* Controls */}
//       <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
//         <button
//           onClick={handleZoomIn}
//           className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
//           title="Zoom In"
//         >
//           <PlusIcon className="h-5 w-5" />
//         </button>
//         <button
//           onClick={handleZoomOut}
//           className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
//           title="Zoom Out"
//         >
//           <MinusIcon className="h-5 w-5" />
//         </button>
//         <button
//           onClick={handleZoomReset}
//           className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-xs font-medium"
//           title="Reset View"
//         >
//           Reset
//         </button>
//       </div>

//       {/* Tree Container */}
//       <div
//         ref={containerRef}
//         className="overflow-auto min-h-[500px] cursor-grab active:cursor-grabbing"
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onMouseLeave={handleMouseUp}
//       >
//         <div
//           className="transition-transform duration-200"
//           style={{
//             transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
//             transformOrigin: 'top left',
//           }}
//         >
//           <div className={`flex ${layout === 'horizontal' ? 'flex-row' : 'flex-col'} p-8 min-w-max min-h-max`}>
//             {treeData.length > 0 ? (
//               treeData.map((root) => renderNode(root))
//             ) : (
//               <div className="text-center text-gray-500 py-12">
//                 <p>No family tree data available</p>
//                 <p className="text-sm">Add members and define relationships to build the tree</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FamilyTreeView;

// src/components/FamilyTreeView.jsx
import { useRef, useEffect, useState } from 'react';
import { PlusIcon, MinusIcon, MagnifyingGlassIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const FamilyTreeView = ({ members, onMemberClick }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [selectedMember, setSelectedMember] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const navigate = useNavigate();

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleZoomReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    setIsPanning(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 2));
  };

  const toggleNode = (memberId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  };

  // Build tree structure from flat members list
  const buildTree = (members) => {
    if (!members || members.length === 0) return [];
    
    const memberMap = {};
    members.forEach(m => {
      memberMap[m._id] = { ...m, children: [], spouse: null };
    });

    const roots = [];

    members.forEach(m => {
      // Add as child to parents
      if (m.father?._id && memberMap[m.father._id]) {
        memberMap[m.father._id].children.push(memberMap[m._id]);
      } else if (m.mother?._id && memberMap[m.mother._id]) {
        memberMap[m.mother._id].children.push(memberMap[m._id]);
      } else {
        // Check if this is a spouse
        const isSpouse = members.some(other => 
          other.spouse?._id === m._id || other.husband?._id === m._id || other.wife?._id === m._id
        );
        if (!isSpouse) {
          roots.push(memberMap[m._id]);
        }
      }

      // Handle spouse relationship
      if (m.husband?._id && memberMap[m.husband._id]) {
        memberMap[m._id].spouse = memberMap[m.husband._id];
      } else if (m.wife?._id && memberMap[m.wife._id]) {
        memberMap[m._id].spouse = memberMap[m.wife._id];
      }
    });

    return roots;
  };

  const treeData = buildTree(members);

  const renderNode = (node, level = 0, isRoot = true) => {
    if (!node) return null;

    const isExpanded = expandedNodes.has(node._id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node._id} className="flex flex-col items-center relative">
        {/* Node Card */}
        <div 
          className={`relative flex flex-col items-center cursor-pointer transition-all duration-200 ${
            selectedMember?._id === node._id ? 'ring-2 ring-primary ring-offset-2' : ''
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedMember(node);
            if (onMemberClick) onMemberClick(node);
            navigate(`/profile/${node._id}`);
          }}
        >
          <div 
            className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow"
            style={{ borderColor: node.isAlive ? '#4CAF50' : '#9E9E9E' }}
          >
            {node.photo ? (
              <img src={node.photo} alt={node.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-lg font-medium text-gray-400">
                  {node.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
          </div>
          <div className="mt-1 text-center max-w-[100px]">
            <p className="text-xs font-medium text-gray-900 truncate">{node.name}</p>
            <p className="text-[10px] text-gray-500">
              {node.generation ? `Gen ${node.generation}` : ''}
              {node.familyNumber ? ` • #${node.familyNumber}` : ''}
            </p>
          </div>

          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node._id);
              }}
              className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border border-gray-300 rounded-full text-xs font-bold hover:bg-gray-50 flex items-center justify-center"
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="relative mt-4">
            {/* Vertical line from parent to children */}
            <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-gray-300 transform -translate-x-1/2" />
            
            <div className="flex flex-row justify-center items-start gap-8 relative">
              {/* Horizontal line connecting children */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-300" />
              
              {node.children.map((child, index) => (
                <div key={child._id} className="relative flex flex-col items-center">
                  {/* Vertical line from horizontal bar to child */}
                  <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-gray-300 transform -translate-x-1/2" />
                  {renderNode(child, level + 1, false)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom In"
        >
          <PlusIcon className="h-5 w-5 text-gray-600" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <MinusIcon className="h-5 w-5 text-gray-600" />
        </button>
        <button
          onClick={handleZoomReset}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Reset View"
        >
          <ArrowsPointingOutIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Tree Container */}
      <div
        ref={containerRef}
        className="overflow-auto min-h-[600px] cursor-grab active:cursor-grabbing bg-gray-50 rounded-lg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="transition-transform duration-200"
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: 'top center',
          }}
        >
          <div className="flex flex-col items-center p-8 min-w-max min-h-max">
            {treeData.length > 0 ? (
              treeData.map((root) => renderNode(root))
            ) : (
              <div className="text-center text-gray-500 py-12">
                <p className="text-lg font-medium">No family tree data available</p>
                <p className="text-sm">Add members and define relationships to build the tree</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Member Count */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        Showing {members?.length || 0} members in the tree
      </div>
    </div>
  );
};

export default FamilyTreeView;