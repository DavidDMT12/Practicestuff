export default function Escrow({
  address,
  arbiter,
  beneficiary,
  valueEth,
  handleApprove,
  isAlreadyApproved,
}) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {valueEth} </div>
        </li>
        {isAlreadyApproved ? (
          <div className="complete">
            ✓ It's been approved!
          </div>
        ) : (
          <div
            className="button"
            id={address}
            onClick={(e) => {
              e.preventDefault();
              handleApprove();
            }}
          >
            Approve
          </div>
        )}
      </ul>
    </div>
  );
}

