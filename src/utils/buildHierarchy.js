export const buildHierarchy = (items = []) => {
  const map = {};
  const tree = [];

  // create map entries (clone so we don't mutate original)
  items.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  // link children
  items.forEach((item) => {
    const parentId = item.parent && item.parent.id ? item.parent.id : null;
    if (parentId && map[parentId]) {
      map[parentId].children.push(map[item.id]);
    } else {
      tree.push(map[item.id]);
    }
  });

  return tree;
};
