interface Props {
  active: boolean;
  onToggle: () => void;
  loading?: boolean;
}

export default function ToggleActive({ active, onToggle, loading }: Props) {
  return (
    <button
      className={`toggle-active ${active ? 'on' : 'off'}`}
      onClick={onToggle}
      disabled={loading}
      title={active ? 'Active - click to deactivate' : 'Inactive - click to activate'}
    >
      <span className="toggle-active-dot"></span>
    </button>
  );
}
