import { immerLoop } from '../../../utils/loop';

export default (props) => {
  const {
    draggable = false,

    treeData,

    // eslint-disable-next-line
    onDrop = ({ resolve, reject, dropZone, dragItem, position }) => {
      console.log(position, dropZone, dragItem);
      resolve();
    },

    onTreeChange,

    ...rest
  } = props;

  if (!draggable) {
    return props;
  }

  return {
    ...rest,

    draggable,

    treeData,
    onDrop: (info) => {
      const { dragNode: dragItemNode, node: dropZoneNode } = info;

      const getPosition = () => {
        if (dropZoneNode.dragOver) {
          return '向内插入';
        }
        if (dropZoneNode.dragOverGapBottom) {
          return '向后插入';
        }
        return '-'; // 向树的最顶部插入
      };

      const position = getPosition();

      new Promise((resolve, reject) => {
        onDrop({
          resolve,
          reject,
          dropZone: dropZoneNode.data,
          dragItem: dragItemNode.data,
          position,
          info,
        });
      }).then(() => {
        const newTreeData = immerLoop({
          array: treeData,
          callback: ({ item, array, index }) => {
            if (item.key === dragItemNode.key) {
              array.splice(index, 1);
              return 'break';
            }
          },
        });

        const finalTreeData = immerLoop({
          array: newTreeData,
          callback: ({ item, array, index }) => {
            if (item.key === dropZoneNode.key) {
              if (position === '向内插入') {
                if (item.children) {
                  item.children.unshift(dragItemNode);
                } else {
                  item.children = [dragItemNode];
                }
                return 'break';
              }

              if (position === '向后插入') {
                array.splice(index + 1, 0, dragItemNode);
                return 'break';
              }

              array.splice(index, 0, dragItemNode);
              return 'break';
            }
          },
        });

        if (onTreeChange) {
          onTreeChange(finalTreeData);
        }
      });
    },
  };
};
