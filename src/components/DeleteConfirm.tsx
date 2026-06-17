import { useState } from 'react';

interface Props {
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteConfirm({ onConfirm, loading }: Props) {
  const [show, setShow] = useState(false);

  if (!show) {
    return (
      <button className="btn-table-action btn-delete" onClick={() => setShow(true)} title="Delete">
        <i className="fas fa-trash-alt"></i>
      </button>
    );
  }

  return (
    <div className="delete-confirm">
      <span className="delete-confirm-text">Are you sure?</span>
      <button className="btn-table-action btn-confirm-delete" onClick={onConfirm} disabled={loading}>
        {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Yes'}
      </button>
      <button className="btn-table-action btn-cancel" onClick={() => setShow(false)}>No</button>
    </div>
  );
}
