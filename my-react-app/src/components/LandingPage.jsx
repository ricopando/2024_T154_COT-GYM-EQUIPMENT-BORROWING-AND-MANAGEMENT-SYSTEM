import buksuLogo from '../assets/buksuLogo.jpg'

function LandingPage() {

    return (
        <div className="container">
            {/* logo container */}
            <div className='logoContainer'>
                <img src={buksuLogo} alt="" />
            </div>

            {/* login and title container */}
            <div className='titleContainer'>
                <h1>GEMBS</h1>
                <p>Find the equipment you need right here <br />
                    Borrow wisely, return timely.</p>
                <button>Continue with google</button>
            </div>
        </div>
    );
}


export default LandingPage