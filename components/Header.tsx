import Link from "next/link";

export const Header = () => {
    return (
        <header className={'bg-white p-5 flex flex-row justify-between items-center max-w-7xl mx-auto'}>
            <div className={'flex-row items-center flex'}>
                <Link href={'/'}>
                    <img className={'w-44 object-contain cursor-pointer mr-6'}
                         src="https://links.papareact.com/yvf" alt="#"/>
                </Link>
                <div className={'hidden md:inline-flex items-center space-x-5'}>
                    <h3>About</h3>
                    <h3>Contact</h3>
                    <h3 className={'bg-green-600 rounded-full px-4 py-1 text-white'}>
                        Follow
                    </h3>
                </div>
            </div>
            <div className={'flex items-center space-x-5 text-green-600'}>
                <h3>Sign In</h3>
                <h3 className={'rounded-full px-4 py-1 border border-green-600'}>Get Started</h3>
            </div>
        </header>
    )
}