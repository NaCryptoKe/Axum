import { useParams } from 'react-router-dom';
import OtpVerification from './OtpVerification';

function OtpVerificationWrapper() {
  const { userId } = useParams();

  if (!userId) {
    return <p>Error: User ID is missing in the URL.</p>;
  }

  return <OtpVerification userId={userId} />;
}

export default OtpVerificationWrapper;
