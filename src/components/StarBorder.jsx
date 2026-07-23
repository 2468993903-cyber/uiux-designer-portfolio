import './StarBorder.css'

const StarBorder = ({
  as: Component = 'button',
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  style,
  ...rest
}) => <Component className={`star-border-container ${className}`} style={{ padding: `${thickness}px 0`, ...style }} {...rest}>
  <div className="border-gradient-bottom" style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }} />
  <div className="border-gradient-top" style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }} />
  <div className="inner-content">{children}</div>
</Component>

export default StarBorder
