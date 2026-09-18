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

  return (
    <div className="extension-box">
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
