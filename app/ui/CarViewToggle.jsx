import { useCustomisation } from "../../contexts/customisation";
import ToggleSwitch from '@/app/ui/toggle'

const CarViewToggle = () => {

    const {
        showCarOnly,
        setShowCarOnly,
    } = useCustomisation();

    const toggleCar = () => {
      setShowCarOnly(prev => (prev === false ? true : false));
    }


    return (
        <div className="flex w-full flex-col relative">
            <div className="">
                <ToggleSwitch option1="" option2="Interior View" status={showCarOnly} toggle_function={toggleCar}/>
            </div>
        </div>

    )
} 

export default CarViewToggle;