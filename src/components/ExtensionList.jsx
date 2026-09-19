function ExtensionList({
  extensions,
  selectedExtensions,
  onToggle,
}) {
  if (extensions.length === 0) {
    return (
      <div className="extension-box">
        Select a watch folder to scan available extensions.
      </div>
    );
  }

  const allSelected =
    extensions.length > 0 &&
    extensions.every((item) =>
      selectedExtensions.includes(item.extension)
    );

  function toggleAll() {
    if (allSelected) {
      extensions.forEach((item) => {
        if (selectedExtensions.includes(item.extension)) {
          onToggle(item.extension);
        }
      });
    } else {
      extensions.forEach((item) => {
        if (!selectedExtensions.includes(item.extension)) {
          onToggle(item.extension);
        }
      });
    }
  }

  return (
    <div className="extension-box">
      <label className="extension-option">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleAll}
        />
        <strong>Select All</strong>
      </label>

      {extensions.map((item) => (
        <label
          key={item.extension}
          className="extension-option"
        >
          <input
            type="checkbox"
            checked={selectedExtensions.includes(item.extension)}
            onChange={() => onToggle(item.extension)}
          />

          <span>{item.extension}</span>
          <span className="extension-count">
            ({item.count})
          </span>
        </label>
      ))}
    </div>
  );
}

export default ExtensionList;