import moment from "moment/moment"

export const fullTime = (time) => {
    return <span className="bg-yellow-100 text-yellow-600 rounded-[4px] px-[7px] py-[2px]">{moment(time).format("DD/MM/YYYY HH:mm:ss")}</span>
}

export const dateTime = (time) => {
    return <span className="bg-yellow-100 text-yellow-600 rounded-[4px] px-[7px] py-[2px]">{moment(time).format("DD/MM/YYYY")}</span>
}