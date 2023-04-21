import produce from 'immer';

const loop = ({
  callback = (props) => {
    console.log(props);
  },
  array = [],
  childrenKey = 'children',
}) => {
  if (array?.length) {
    for (let index = array.length - 1; index >= 0; index -= 1) {
      const result =
        callback({
          item: array[index],
          array,
          index,
        }) || 'default';

      if (result === 'break') {
        // “跳出”循环
        break;
      } else if (result === 'continue') {
        // “跳过”当前循环，进入下个循环
        continue; // eslint-disable-line
      } else {
        /**
         * 执行“递归”
         */
        const item = array[index];

        if (item?.[childrenKey]) {
          loop({
            callback,
            array: item[childrenKey],
            childrenKey,
          });
        }
      }
    }
  }
};

const immerLoop = ({
  callback = (props) => {
    console.log(props);
  },
  array = [],
  childrenKey = 'children',
}) => {
  return produce(array, (draftState) => {
    loop({
      callback,
      array: draftState,
      childrenKey,
    });
  });
};

export { immerLoop };
