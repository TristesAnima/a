import { getFiletype } from '../../../../utils/unclassified';

export default (props) => {
  const { filetype, src, style, ...rest } = props;

  const newFiletype = getFiletype(filetype || src);

  return {
    ...rest,

    filetype: newFiletype,

    src: /(doc|xls|ppt|dot)x?/i.test(newFiletype)
      ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(src)}`
      : src,
    style: {
      position: 'relative',
      width: '100%',
      height: 'calc(100vh - 155px)',
      overflow: 'auto',
      ...style,
    },
  };
};
