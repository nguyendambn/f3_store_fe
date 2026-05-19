import React from "react";

const TreeCategory = ({ records, level = 0, parentId }) => {
  return (
    <>
      {records.map((cat) => (
        <React.Fragment key={cat.id}>
          <option value={cat.id}>{`${"— ".repeat(level)}${cat.name}`}</option>
          {cat.children && cat.children.length > 0 && (
            <TreeCategory
              records={cat.children}
              level={level + 1}
              parentId={parentId}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default TreeCategory;
