export default function PrimaryAction({ text, onClick, type = "button" }) {
  return (
    <button type={type} className="btn btn-primary primary-action" onClick={onClick}>
      {text}
    </button>
  )
}
