import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const ViewMyBooking = () => {
  const [allBookings, setAllBookings] = useState([]);

  let navigate = useNavigate();

  let user = JSON.parse(sessionStorage.getItem("active-customer"));

  useEffect(() => {
    const getAllBooking = async () => {
      const allBooking = await retrieveAllBooking();
      if (allBooking) {
        setAllBookings(allBooking.bookings);
      }
    };

    getAllBooking();
  }, []);

  const retrieveAllBooking = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/book/hotel/fetch?userId=" + user.id
    );
    console.log(response.data);
    return response.data;
  };

  // /hotel/booking/detail

  const navigateToHotelBookingPage = (booking) => {
    navigate("/hotel/booking/detail", { state: booking });
  };

  const cancelHotelBooking = (bookingId) => {
    fetch("http://localhost:8080/api/book/hotel/update/status", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //    Authorization: "Bearer " + admin_jwtToken,
      },
      body: JSON.stringify({
        bookingId: bookingId,
        status: "Cancel",
      }),
    })
      .then((result) => {
        console.log("result", result);
        result.json().then((res) => {
          if (res.responseCode === 0) {
            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setTimeout(() => {
              window.location.reload(true);
            }, 1000); // Redirect after 3 seconds
          } else if (res.responseCode === 1) {
            toast.error(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            setTimeout(() => {
              window.location.reload(true);
            }, 1000); // Redirect after 3 seconds
          } else {
            toast.error("It seems server is down", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            setTimeout(() => {
              window.location.reload(true);
            }, 1000); // Redirect after 3 seconds
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 custom-bg border-color "
        style={{
          height: "45rem",
        }}
      >
        <div className="card-header custom-bg-text text-center bg-color">
          <h2>My Bookings</h2>
        </div>
        <div
          className="card-body"
          style={{
            overflowY: "auto",
          }}
        >
          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">Hotel</th>
                  <th scope="col">Hotel Name</th>
                  <th scope="col">Hotel Email</th>
                  <th scope="col">Hotel Contact</th>
                  <th scope="col">Booking Id</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Customer Contact</th>
                  <th scope="col">Check In</th>
                  <th scope="col">Check Out</th>
                  <th scope="col">Total Day</th>
                  <th scope="col">Room No</th>
                  <th scope="col">Total Person</th>
                  <th scope="col">Total Payable Amount</th>
                  <th scope="col">Booking Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map((booking) => {
                  return (
                    <tr>
                      <td>
                        <img
                          src={
                            "http://localhost:8080/api/hotel/" +
                            booking.hotelImage
                          }
                          class="img-fluid"
                          alt="product_pic"
                          style={{
                            maxWidth: "90px",
                          }}
                        />
                      </td>

                      <td>
                        <b>{booking.hotelName}</b>
                      </td>
                      <td>
                        <b>{booking.hotelEmail}</b>
                      </td>
                      <td>
                        <b>{booking.hotelContact}</b>
                      </td>

                      <td>
                        <b>{booking.bookingId}</b>
                      </td>
                      <td>
                        <b>{booking.customerName}</b>
                      </td>
                      <td>
                        <b>{booking.customerContact}</b>
                      </td>

                      <td>
                        <b>{booking.checkIn}</b>
                      </td>
                      <td>
                        <b>{booking.checkOut}</b>
                      </td>
                      <td>
                        <b>{booking.totalDay}</b>
                      </td>
                      <td>
                        <b>{booking.hotelRoomId}</b>
                      </td>
                      <td>
                        <b>{booking.totalPerson}</b>
                      </td>
                      <td>
                        <b>{booking.totalAmount}</b>
                      </td>
                      <td>
                        <b>{booking.status}</b>
                      </td>
                      <td>
                        {(() => {
                          if (booking.status === "Approved") {
                            return (
                              <div>
                                {" "}
                                <button
                                  className="btn bg-color custom-bg-text"
                                  onClick={() =>
                                    navigateToHotelBookingPage(booking)
                                  }
                                >
                                  <b>Pay</b>
                                </button>
                                <button
                                  className="btn bg-color custom-bg-text"
                                  onClick={() => cancelHotelBooking(booking.id)}
                                >
                                  <b>Cancel</b>
                                </button>
                              </div>
                            );
                          }
                        })()}

                        {(() => {
                          if (booking.status === "Pending") {
                            return (
                              <button
                                className="btn bg-color custom-bg-text"
                                onClick={() => cancelHotelBooking(booking.id)}
                              >
                                <b>Cancel</b>
                              </button>
                            );
                          }
                        })()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMyBooking;
