import { Children } from 'react'
import './Dock.css'

export default function Dock({ children, className = '' }) {
  return <div className={`dock-project-panel ${className}`}>
    {Children.map(children, child => <div className="dock-project-item">{child}</div>)}
  </div>
}
