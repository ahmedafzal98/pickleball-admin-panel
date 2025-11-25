import React, { useEffect, useState } from "react";
import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { getCategories } from "../api/categoryService";
import { buildCategoryTree } from "../utils/buildHierarchy";

const CategoryTree = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then((res) =>
      setCategories(buildCategoryTree(res.data.data))
    );
  }, []);

  const renderTree = (nodes) =>
    nodes.map((node) => (
      <TreeItem key={node.id} nodeId={node.id.toString()} label={node.name}>
        {node.children && node.children.length > 0
          ? renderTree(node.children)
          : null}
      </TreeItem>
    ));

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(categories)}
    </TreeView>
  );
};

export default CategoryTree;
