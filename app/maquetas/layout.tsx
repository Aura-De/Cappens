import './maquetas.css';

export default function MaquetasLayout({ children }: { children: React.ReactNode }) {
  return <div className="mq-root">{children}</div>;
}
