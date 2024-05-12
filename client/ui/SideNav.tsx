import { Terrain } from "./Terrain"
import { Zoom } from "./Zoom"
import { Stack } from "./layout-utilities/Cluster"

import admin from "../images/icons/admin.png";
import agriculture from "../images/icons/agriculture.png";
import civic from "../images/icons/civic.png";
import entertainment from "../images/icons/entertainment.png";
import house from "../images/icons/house.png";
import industry from "../images/icons/industry.png";
import storage from "../images/icons/storage.png";

export const SideNav = () => {
  const icons = useSidePanelCategories();
  return (
    <Stack>
      {icons.map(icon => {
        return <span>
        {/* {icon.label} */}
        <img src={icon.image} style={{width: '3rem'}}></img>
      </span>
      })
    }
    </Stack>
  )
}

const useSidePanelCategories = () => {
  return [
    {label: "S", image: admin},
    {label: "S", image: agriculture},
    {label: "S", image: civic},
    {label: "S", image: entertainment},
    {label: "S", image: house},
    {label: "S", image: industry},
    {label: "S", image: storage},
  ]
}