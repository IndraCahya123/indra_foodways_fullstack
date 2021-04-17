export const locToObj = (locString) => {
    if (locString == "") {
        return null;
    } else {
        const values = locString?.split(",");
        let getValues = [];
        for (let i = 0; i < values?.length; i++) {
            getValues.push(values[i]);
        }

        const locObj = {
            latitude: parseFloat(getValues[0]),
            longitude: parseFloat(getValues[1])
        }
        
        return locObj;
    }
}