import WalletBalance from '../components/getBalance'
import ProfileInfo from '../components/getProfileInfo'

const Profile = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
      <WalletBalance />
      <ProfileInfo/>
      </div>
  )
}

export default Profile