import { Link } from 'react-router-dom';

interface Props {
  title: string;
  subtitle: string;
  breadcrumb?: { label: string; path?: string }[];
}

export default function PageHeader({ title, subtitle, breadcrumb }: Props) {
  return (
    <div className="page-header">
      <div className="container">
        <h1 className="page-header-title">{title}</h1>
        <p className="page-header-subtitle">{subtitle}</p>
        {breadcrumb && (
          <nav className="breadcrumb-custom">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              {breadcrumb.map((item, i) => (
                <li key={i} className={`breadcrumb-item ${item.path ? '' : 'active'}`}>
                  {item.path ? <Link to={item.path}>{item.label}</Link> : item.label}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </div>
  );
}
