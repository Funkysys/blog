import FirstTitle from "./FirstTitle"
import { HeaderNavigation } from "./HeaderNavigation"
import ProfileButton from "./ProfileButton"
import ResponsiveMenu from "./ResponsiveMenu"
import ToggleTheme from "./ToggleTheme"

const Header = () => {
    return (
        <header className='flex items-center justify-between p-4 border-b w-full'>
            <div className="flex items-center gap-2">
                <ResponsiveMenu />
                <FirstTitle />
            </div>

            <HeaderNavigation />
            <div className=" flex items-center gap-2">
                <ToggleTheme />
                <ProfileButton />
            </div>
        </header>
    )
}

export default Header