import { useState, useContext } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { TokenContext } from "../../contexts/AuthContext"
import SignBtn from "./SignBtn"
import logo from "../../assets/white_king.svg"
import DarkReducer from "./DarkReducer"

const Header = () => {
  const { token, resetToken } = useContext(TokenContext)
  const menuItem =
    "relative flex h-full items-center p-4 cursor-pointer font-bold text-white hover:bg-white/10 transition-colors ease-in-out"
  const mobileItem =
    "relative flex h-full items-center p-4 cursor-pointer justify-center font-bold text-white hover:bg-white/10 transition-colors ease-in-out"
  const goGradient = "bg-gradient-to-r from-[#00ADD8] to-[#00A29C]"
  const logoText =
    "font-bold text-2xl text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
  const line = `h-1 w-8 my-1 rounded-full bg-white transition ease transform duration-300`
  const [isOpen, setIsOpen] = useState(false)
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = () => {
    resetToken()
    setShowSignOutModal(false) 
    navigate("/")
  }

  return (
    <nav className={`flex items-center top-0 ${goGradient}`}>
      <div className="flex items-center p-2 gap-2">
        <Link to={`/`}>
          <img src={logo} alt="white King" width={50} />
        </Link>
        <div className={`${logoText}`}>
          <Link to={`/`}>Go Chess</Link>
        </div>
      </div>

      {/* mobile nav */}
      {/* button && button animation */}
      <button
        className="md:hidden flex flex-col ml-auto pr-4 my-auto cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={`${line} ${
            isOpen ? "rotate-45 translate-y-3 opacity-100" : "opacity-100"
          }`}
        />
        <div className={`${line} ${isOpen ? "opacity-0" : "opacity-100"}`} />
        <div
          className={`${line} ${
            isOpen ? "-rotate-45 -translate-y-3 opacity-100" : "opacity-100"
          }`}
        />
        {/* submenu */}
        <div
          className={`absolute top-16 ${goGradient} w-full left-0 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <Link to={`/`} className={`${mobileItem}`}>
            Home
          </Link>
          <Link to={`/play`} className={`${mobileItem}`}>
            Play
          </Link>
          <Link to={`/learn`} className={`${mobileItem}`}>
            Learn
          </Link>
		{token && (
        <Link to={`/account`} className={`${mobileItem}`}>
          Account
        </Link>
    	)}
			<SignBtn className={mobileItem}/>
          <DarkReducer className={`${mobileItem}`} />
        </div>
      </button>

      {/* desktop nav */}
      <div className="hidden md:flex flex-1 items-center justify-end">
        <Link to={`/`} className={`${menuItem}`}>
          Home
        </Link>
        <Link to={`/play`} className={`${menuItem}`}>
          Play
        </Link>
        <Link to={`/learn`} className={`${menuItem}`}>
          Learn
        </Link>
		{token && (
        <Link to={`/account`} className={`${menuItem}`}>
          Account
        </Link>
    	)}
       	<SignBtn className={menuItem}/> 
        <DarkReducer />
      </div>

      {/* Sign Out Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <p className="text-gray-800 mb-4">
              Are you sure you want to sign out?
            </p>
            <div className="flex justify-end">
              <button
                className="mr-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setShowSignOutModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Header
