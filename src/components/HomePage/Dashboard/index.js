import React from "react";
import EventList from "./EventList";
import MyEventList from "./MyEventList";
import AddEventPopup from '../../AddEventPage'

const Dashboard = () => {
  return <div className="dashboard container">
    <div className="center" style={{padding:"20px"}}>
      <AddEventPopup />
    </div>
    <div className="row">
        <div className="col s2">
            <p>Categories</p>
        </div>
        <div className="col s6">
            <EventList />
        </div>
        <div className="col s4">
            <MyEventList />
        </div>
    </div>
  </div>
}

export default Dashboard;