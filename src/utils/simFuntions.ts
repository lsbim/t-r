import { facilities } from "../data/facilities";
import { SimRequest } from "../types/sim/simTypes";
import { translateFacility } from "./function";

export const simFacility = (request: SimRequest) => {

    const targets = Object.entries(request.target);

    console.log(targets);
    targets.forEach(([key, value]) => {

        const krName = translateFacility(key);
        if(!krName) return;

        console.log(krName, value)

        const temp1 = facilities[krName]
        console.log(temp1)
    })
}