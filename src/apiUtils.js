
import axios from 'axios';

// Dynamic token function to get current token
const getToken = () => localStorage.getItem("token");

function convertDateTime(dateTimeString) {
  if (dateTimeString) {
    const date = new Date(dateTimeString);
    const dateOptions = { day: "2-digit", month: "short", year: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };

    const formattedDate = date.toLocaleDateString("en-GB", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

    return `${formattedDate}: ${formattedTime}`;
  }
  return "";
}

const postDataV2 = (parameter) => {
  // if (!token) {
  //   console.error("JWT token not found in local storage");
  //   return;
  // }

  axios
    .post(`${process.env.REACT_APP_API_URL}${parameter?.url}`, parameter?.payload, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    .then((response) => {
      const successMessageColor = "#4285F4";
      const { status } = response;
      if (parameter?.navigate) {
        parameter?.navigate(`${parameter?.navUrl}`, {
          state: {
            successMessage: "Successfully Created!",
            successMessageColor,
          },
        });
      }
      else {
        // window.location.reload();
      }
    })
    .catch((error) => {
      console.log("error:", error.response?.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce((acc, [field, messages]) => {
              if (Array.isArray(messages)) {
                // If messages is an array, join them and remove index prefixes like "0:"
                const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
                acc.push(` ${cleanedMessages.join(", ")}`);
              } else if (typeof messages === "string") {
                // If messages is a string, remove index prefix if present
                acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
              } else {
                // Handle unexpected data types
                acc.push(`${field}: Unknown error format`);
              }
              return acc;
            }, []);

            // Set errors in the state
            if (errors.length) {
              parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
            } else {
              parameter?.setErrors("Something went wrong. Please try again later.");
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          alert("Unauthorized access. Redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        parameter?.setErrors("No response received from the server. Please try again.");
      } else {
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(`An error occurred: ${error.message}`);
      }
    });






};


const postDataReturnId = (parameter) => {


  axios
    .post(`${process.env.REACT_APP_API_URL}${parameter?.url}`, parameter?.payload, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    .then((response) => {
      parameter?.setUserId(response?.data?.id)
      const successMessageColor = "#4285F4";
      const { status } = response;
      if (parameter?.navigate) {
        parameter?.navigate(`${parameter?.navUrl}/${response.data.id}`, {
          state: {
            successMessage: "Successfully Created!",
            successMessageColor,
          },
        });
      }
      else {
        // window.location.reload();
      }
    })
    .catch((error) => {
      console.log("error:", error.response?.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce((acc, [field, messages]) => {
              if (Array.isArray(messages)) {
                // If messages is an array, join them and remove index prefixes like "0:"
                const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
                acc.push(` ${cleanedMessages.join(", ")}`);
              } else if (typeof messages === "string") {
                // If messages is a string, remove index prefix if present
                acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
              } else {
                // Handle unexpected data types
                acc.push(`${field}: Unknown error format`);
              }
              return acc;
            }, []);

            // Set errors in the state
            if (errors.length) {
              parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
            } else {
              parameter?.setErrors("Something went wrong. Please try again later.");
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          alert("Unauthorized access. Redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        parameter?.setErrors("No response received from the server. Please try again.");
      } else {
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(`An error occurred: ${error.message}`);
      }
    });






};

const postDataReturnResponse = (parameter) => {


  axios
    .post(`${process.env.REACT_APP_API_URL}${parameter?.url}`, parameter?.payload, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    .then((response) => {
      parameter?.setUserId(response?.data)
    })
    .catch((error) => {
      console.log("error:", error.response?.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce((acc, [field, messages]) => {
              if (Array.isArray(messages)) {
                // If messages is an array, join them and remove index prefixes like "0:"
                const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
                acc.push(` ${cleanedMessages.join(", ")}`);
              } else if (typeof messages === "string") {
                // If messages is a string, remove index prefix if present
                acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
              } else {
                // Handle unexpected data types
                acc.push(`${field}: Unknown error format`);
              }
              return acc;
            }, []);

            // Set errors in the state
            if (errors.length) {
              parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
            } else {
              parameter?.setErrors("Something went wrong. Please try again later.");
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          alert("Unauthorized access. Redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        parameter?.setErrors("No response received from the server. Please try again.");
      } else {
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(`An error occurred: ${error.message}`);
      }
    });
};
const ReturnResponseFormdataWithoutToken = (parameter) => {


  axios
    .post(`${process.env.REACT_APP_API_URL}${parameter?.url}`, parameter?.formData, {
      headers: {
      'Content-Type': 'multipart/form-data'
      },
    })
    .then((response) => {
      parameter?.setUserId(response?.data)
    })
    .catch((error) => {
      console.log("error:", error.response?.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce((acc, [field, messages]) => {
              if (Array.isArray(messages)) {
                // If messages is an array, join them and remove index prefixes like "0:"
                const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
                acc.push(` ${cleanedMessages.join(", ")}`);
              } else if (typeof messages === "string") {
                // If messages is a string, remove index prefix if present
                acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
              } else {
                // Handle unexpected data types
                acc.push(`${field}: Unknown error format`);
              }
              return acc;
            }, []);

            // Set errors in the state
            if (errors.length) {
              parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
            } else {
              parameter?.setErrors("Something went wrong. Please try again later.");
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          alert("Unauthorized access. Redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        parameter?.setErrors("No response received from the server. Please try again.");
      } else {
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(`An error occurred: ${error.message}`);
      }
    });
};
const ReturnPutResponseFormdataWithoutToken = (parameter) => {


  axios
    .put(`${process.env.REACT_APP_API_URL}${parameter?.url}`, parameter?.formData, {
      headers: {
      'Content-Type': 'multipart/form-data'
      },
    })
    .then((response) => {
      parameter?.setUserId(response?.data)
    })
    .catch((error) => {
      console.log("error:", error.response?.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce((acc, [field, messages]) => {
              if (Array.isArray(messages)) {
                // If messages is an array, join them and remove index prefixes like "0:"
                const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
                acc.push(` ${cleanedMessages.join(", ")}`);
              } else if (typeof messages === "string") {
                // If messages is a string, remove index prefix if present
                acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
              } else {
                // Handle unexpected data types
                acc.push(`${field}: Unknown error format`);
              }
              return acc;
            }, []);

            // Set errors in the state
            if (errors.length) {
              parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
            } else {
              parameter?.setErrors("Something went wrong. Please try again later.");
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          alert("Unauthorized access. Redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        parameter?.setErrors("No response received from the server. Please try again.");
      } else {
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(`An error occurred: ${error.message}`);
      }
    });
};


const postDataWithoutToken = (parameter) => {


  axios
    .post(`${process.env.REACT_APP_API_URL}${parameter?.url}`, parameter?.payload, {

    })
    .then((response) => {
      const successMessageColor = "#4285F4";
      const { status } = response;
      if (parameter?.navigate) {
        parameter?.navigate(`${parameter?.navUrl}`, {
          state: {
            successMessage: "Successfully Created!",
            successMessageColor,
          },
        });
      }
      else {
        // window.location.reload();
      }
    })
    .catch((error) => {
      console.log("error:", error.response?.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce((acc, [field, messages]) => {
              if (Array.isArray(messages)) {
                // If messages is an array, join them and remove index prefixes like "0:"
                const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
                acc.push(` ${cleanedMessages.join(", ")}`);
              } else if (typeof messages === "string") {
                // If messages is a string, remove index prefix if present
                acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
              } else {
                // Handle unexpected data types
                acc.push(`${field}: Unknown error format`);
              }
              return acc;
            }, []);

            // Set errors in the state
            if (errors.length) {
              parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
            } else {
              parameter?.setErrors("Something went wrong. Please try again later.");
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          alert("Unauthorized access. Redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        parameter?.setErrors("No response received from the server. Please try again.");
      } else {
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(`An error occurred: ${error.message}`);
      }
    });






};

const postDataWithFetchV2 = (parameter) => {
  if (!getToken()) {
    console.error("JWT token not found in local storage");
    return;
  }

  axios
    .post(
      `${process.env.REACT_APP_API_URL}${parameter?.url}`,
      parameter?.payload,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    )
    .then((response) => {
      const successMessageColor = "#4285F4";
      const { status } = response;
      
      // Handle success callback for photo requests
      if (status === 201 || status === 200) {
        if (parameter?.setSuccessMessage) {
          parameter.setSuccessMessage("Photo request sent successfully!");
        }
        console.log('API Success Response:', response.data);
      }
      
      if (parameter?.tofetch) {
        if (status === 201 || status === 200) {
          parameter?.tofetch?.setSuccessMessage(true);
         
          if (
            parameter?.tofetch?.items &&
            Array.isArray(parameter?.tofetch.items)
          ) {
            parameter?.tofetch.items.forEach((item) => {
              if (item.fetchurl && item.dataset) {
                const parameter = {
                  url: item.fetchurl,
                  setterFunction: item.dataset,
                };
                fetchDataV2(parameter);
              }
            });
          }
          if (parameter?.tofetch?.setSuccessCallback) {
            parameter?.tofetch?.setSuccessCallback(true);
          }
          if (parameter?.tofetch?.navigate) {
            parameter?.tofetch?.navigate(`${parameter?.tofetch?.navUrl}`, {
              state: {
                successMessage: "Successfully Created!",
                successMessageColor,
              },
            });
          }
        }
      }
    })
    .catch((error) => {
      console.log("error:", error.response?.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (status === 500) {
            parameter.setErrors(
              "Something went wrong. Please try again later."
            )
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
            return;
          }
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce(
              (acc, [field, messages]) => {
                if (Array.isArray(messages)) {
                  // If messages is an array, join them and remove index prefixes like "0:"
                  const cleanedMessages = messages.map((msg) =>
                    msg.replace(/^\d+:\s*/, "")
                  );
                  acc.push(` ${cleanedMessages.join(", ")}`);
                } else if (typeof messages === "string") {
                  // If messages is a string, remove index prefix if present
                  acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
                } else {
                  // Handle unexpected data types
                  acc.push(`${field}: Unknown error format`);
                }
                return acc;
              },
              []
            );

            // Set errors in the state
            if (errors.length) {
              parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
            } else {
              parameter?.setErrors(
                "Something went wrong. Please try again later."
              );
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          alert("Unauthorized access. Redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        parameter?.setErrors(
          "No response received from the server. Please try again."
        );
      } else {
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(`An error occurred: ${error.message}`);
      }
    });
};
const putDataWithFetchV2 = (parameter) => {
  if (!getToken()) {
    console.error("JWT token not found in local storage");
    return;
  }

  axios
    .put(
      `${process.env.REACT_APP_API_URL}${parameter?.url}`,
      parameter?.payload,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    )
    .then((response) => {
      console.log(parameter?.payload);
      
      const successMessageColor = "#4285F4";
      const { status } = response;
      if (parameter?.tofetch) {
        if (status === 201 || status === 200) {
          parameter?.tofetch?.setSuccessMessage(true);
          const timeoutId = setTimeout(() => {
            parameter?.tofetch?.setSuccessMessage(false);
          }, 5000);
          if (
            parameter?.tofetch?.items &&
            Array.isArray(parameter?.tofetch.items)
          ) {
            parameter?.tofetch.items.forEach((item) => {
              console.log("i a jj")
              if (item.fetchurl && item.dataset) {
                const parameter = {
                  url: item.fetchurl,
                  setterFunction: item.dataset,
                  setSuccessMessage: item.setSuccessMessage,
                  setErrors:item.setErrors,
                };
                fetchDataWithTokenV2(parameter);
              }
            });
          }
          if (parameter?.tofetch?.setSuccessCallback) {
            parameter?.tofetch?.setSuccessCallback(true);
          }
          if (parameter?.tofetch?.navigate) {
            parameter?.tofetch?.navigate(`${parameter?.tofetch?.navUrl}`, {
              state: {
                successMessage: "Successfully Created!",
                successMessageColor,
              },
            });
          }
        }
      }
    })
    .catch((error) => {
      console.log("error:", error.response?.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (status === 500) {
            parameter.setErrors(
              "Something went wrong. Please try again later."
            )
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
            return;
          }
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce(
              (acc, [field, messages]) => {
                if (Array.isArray(messages)) {
                  // If messages is an array, join them and remove index prefixes like "0:"
                  const cleanedMessages = messages.map((msg) =>
                    msg.replace(/^\d+:\s*/, "")
                  );
                  acc.push(` ${cleanedMessages.join(", ")}`);
                } else if (typeof messages === "string") {
                  // If messages is a string, remove index prefix if present
                  acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
                } else {
                  // Handle unexpected data types
                  acc.push(`${field}: Unknown error format`);
                }
                return acc;
              },
              []
            );

            // Set errors in the state
            if (errors.length) {
              parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
            } else {
              parameter?.setErrors(
                "Something went wrong. Please try again later."
              );
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          alert("Unauthorized access. Redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        parameter?.setErrors(
          "No response received from the server. Please try again."
        );
      } else {
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(`An error occurred: ${error.message}`);
      }
    });
};


// const registration = (parameter) => {
//   axios.post(`${process.env.REACT_APP_API_URL}${parameter?.url}`, parameter?.payload, {}).then((response) => {
//     console.log("darta : ", response.data)


//     localStorage.setItem("token", response?.data?.access_token)
//     localStorage.setItem("refres", response?.data?.refresh_token)
//     localStorage.setItem("userId", response?.data?.id)
//     const successMessageColor = "#4285F4";
//     const { status } = response;
//     if (parameter?.navigate) {
//       parameter?.navigate(`${parameter?.navUrl}`, {
//         state: {
//           successMessage: "Successfully Created!",
//           successMessageColor,
//         },
//       });
//     }
//     else {
//       // window.location.reload();
//     }
//   })
//     .catch((error) => {
//       console.log("error:", error.response?.data);

//       if (error.response) {
//         const { status, data } = error.response;

//         if (status === 400 || status >= 500) {
//           if (data) {
//             console.log("Handling error response data...");

//             // Process and collect error messages
//             const errors = Object.entries(data).reduce((acc, [field, messages]) => {
//               if (Array.isArray(messages)) {
//                 // If messages is an array, join them and remove index prefixes like "0:"
//                 const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
//                 acc.push(` ${cleanedMessages.join(", ")}`);
//               } else if (typeof messages === "string") {
//                 // If messages is a string, remove index prefix if present
//                 acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
//               } else {
//                 // Handle unexpected data types
//                 acc.push(`${field}: Unknown error format`);
//               }
//               return acc;
//             }, []);

//             // Set errors in the state
//             if (errors.length) {
//               parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
//             } else {
//               parameter?.setErrors("Something went wrong. Please try again later.");
//             }

//             // Clear the errors after a delay (optional)
//             setTimeout(() => {
//               parameter?.setErrors(null);
//             }, 5000);
//           }
//         } else if (status === 401) {
//           alert("Unauthorized access. Redirecting to login...");
//           localStorage.clear();
//           window.location.href = "/login";
//         }

//         console.error("Response Status:", status);
//         console.error("Response Data:", data);
//       } else if (error.request) {
//         console.error("No response received:", error.request);
//         parameter?.setErrors("No response received from the server. Please try again.");
//       } else {
//         console.error("Error setting up the request:", error.message);
//         parameter?.setErrors(`An error occurred: ${error.message}`);
//       }
//     });






// };

const registration = (parameter) => {
  axios
    .post(`${process.env.REACT_APP_API_URL}${parameter?.url}`, parameter?.payload, {})
    .then((response) => {
      console.log("data : ", response.data);

      // Store tokens and user ID in localStorage
      localStorage.setItem("token", response?.data?.access_token||response?.data?.access||'');
      localStorage.setItem("refresh", response?.data?.refresh_token||'');
      localStorage.setItem("userId", response?.data?.id);
      localStorage.setItem("name", `${response?.data?.first_name ||''} ${response?.data?.last_name ||""}` || "");

      // Show success message
      if (parameter?.showSuccessMessage) {
        parameter.showSuccessMessage("Successfully Created!");
      }

      // Navigate to the specified URL
      if (parameter?.navigate) {
        // For agent registration, use the response ID in the URL
        const navUrl = parameter?.navUrl?.includes('agentstepone') 
          ? `/agentstepone/${response?.data?.id}` 
          : parameter?.navUrl;
        
        parameter.navigate(navUrl, {
          state: {
            successMessage: "Successfully Created!",
            successMessageColor: "#4285F4",
          },
        });
      } else {
        // Optionally reload the page if no navigation is provided
        // window.location.reload();
      }
    })
    .catch((error) => {
      console.log("error:", error.response?.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce((acc, [field, messages]) => {
              if (Array.isArray(messages)) {
                const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
                acc.push(` ${cleanedMessages.join(", ")}`);
              } else if (typeof messages === "string") {
                acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
              } else {
                acc.push(`${field}: Unknown error format`);
              }
              return acc;
            }, []);

            // Set errors in the state
            if (errors.length) {
              const errorMessage = errors.join("\n");
              parameter?.setErrors(errorMessage);
              if (parameter?.showErrorMessage) {
                parameter.showErrorMessage(errorMessage);
              }
            } else {
              const defaultErrorMessage = "Something went wrong. Please try again later.";
              parameter?.setErrors(defaultErrorMessage);
              if (parameter?.showErrorMessage) {
                parameter.showErrorMessage(defaultErrorMessage);
              }
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          const unauthorizedMessage = "Unauthorized access. Redirecting to login...";
          alert(unauthorizedMessage);
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        const noResponseMessage = "No response received from the server. Please try again.";
        console.error("No response received:", error.request);
        parameter?.setErrors(noResponseMessage);
        if (parameter?.showErrorMessage) {
          parameter.showErrorMessage(noResponseMessage);
        }
      } else {
        const requestErrorMessage = `An error occurred: ${error.message}`;
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(requestErrorMessage);
        if (parameter?.showErrorMessage) {
          parameter.showErrorMessage(requestErrorMessage);
        }
      }
    });
};

const justpostDataWithoutToken = async (parameter) => {

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}${parameter.url}`,
      parameter.payload,
      {}
    );

    const { status } = response;
    console.log('response', response);

    if (status === 200 || status === 201) {
      // Handle successful response
      const successMessageColor = "#4285F4";
      console.log("OTP sent successfully!");
      // You can add additional logic here, such as showing a success message to the user.
    }
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400 || status >= 500) {
        // Handle validation or server errors
        if (data) {
          console.log("Handling error response data...");

          // Process and collect error messages
          const errors = Object.entries(data).reduce((acc, [field, messages]) => {
            if (Array.isArray(messages)) {
              // If messages is an array, join them and remove index prefixes like "0:"
              const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
              acc.push(`${field}: ${cleanedMessages.join(", ")}`);
            } else if (typeof messages === "string") {
              // If messages is a string, remove index prefix if present
              acc.push(`${field}: ${messages.replace(/^\d+:\s*/, "")}`);
            } else {
              // Handle unexpected data types
              acc.push(`${field}: Unknown error format`);
            }
            return acc;
          }, []);

          // Set errors in the state
          if (errors.length) {
            parameter.setApiErrors(errors.join("\n")); // Pass errors as a joined string
          } else {
            parameter.setApiErrors("Something went wrong. Please try again later.");
          }

          // Clear the errors after a delay (optional)
          setTimeout(() => {
            parameter.setApiErrors(null);
          }, 5000);
        }
      } else if (status === 401) {
        // Handle unauthorized access
        alert("Unauthorized access. Redirecting to login...");
        localStorage.clear();
        window.location.href = "/login";
      }

      console.error("Response Status:", status);
      console.error("Response Data:", data);
    } else if (error.request) {
      // Handle no response from the server
      console.error("No response received:", error.request);
      parameter.setApiErrors("No response received from the server. Please try again.");
    } else {
      // Handle request setup errors
      console.error("Error setting up the request:", error.message);
      parameter.setApiErrors(`An error occurred: ${error.message}`);
    }
  }
};

const updateDataV2 = (parameter) => {
  const token = getToken();
  if (!getToken()) {
    console.error("JWT token not found in local storage");
    return;
  }

  axios
    .put(`${process.env.REACT_APP_API_URL}${parameter?.url}/`, parameter?.payload, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    .then(() => {
      if (parameter?.navigate) {
        parameter?.navigate(`${parameter?.navUrl}`)

      }
    })
    .catch((error) => {
      console.log("error:", error.response?.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce((acc, [field, messages]) => {
              if (Array.isArray(messages)) {
                // If messages is an array, join them and remove index prefixes like "0:"
                const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
                acc.push(` ${cleanedMessages.join(", ")}`);
              } else if (typeof messages === "string") {
                // If messages is a string, remove index prefix if present
                acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
              } else {
                // Handle unexpected data types
                acc.push(`${field}: Unknown error format`);
              }
              return acc;
            }, []);

            // Set errors in the state
            if (errors.length) {
              parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
            } else {
              parameter?.setErrors("Something went wrong. Please try again later.");
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          alert("Unauthorized access. Redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        parameter?.setErrors("No response received from the server. Please try again.");
      } else {
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(`An error occurred: ${error.message}`);
      }
    });

};
const updateDataReturnId = (parameter) => {


  axios
    .put(`${process.env.REACT_APP_API_URL}${parameter?.url}`, parameter?.payload, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    .then((response) => {
      if (parameter?.setUserId) {
        parameter?.setUserId(response?.data?.id)
      }
      const successMessageColor = "#4285F4";
      const { status } = response;
      if (parameter?.navigate) {
        parameter?.navigate(`${parameter?.navUrl}`, {
          state: {
            successMessage: "Successfully Created!",
            successMessageColor,
          },
        });
      }
      else {
        // window.location.reload();
      }
    })
    .catch((error) => {
      console.log("error:", error.response?.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce((acc, [field, messages]) => {
              if (Array.isArray(messages)) {
                // If messages is an array, join them and remove index prefixes like "0:"
                const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
                acc.push(` ${cleanedMessages.join(", ")}`);
              } else if (typeof messages === "string") {
                // If messages is a string, remove index prefix if present
                acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
              } else {
                // Handle unexpected data types
                acc.push(`${field}: Unknown error format`);
              }
              return acc;
            }, []);

            // Set errors in the state
            if (errors.length) {
              parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
            } else {
              parameter?.setErrors("Something went wrong. Please try again later.");
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          alert("Unauthorized access. Redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        parameter?.setErrors("No response received from the server. Please try again.");
      } else {
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(`An error occurred: ${error.message}`);
      }
    });
};
const updatePostDataReturnId = (parameter) => {


  axios
    .post(`${process.env.REACT_APP_API_URL}${parameter?.url}`, parameter?.payload, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    .then((response) => {
      localStorage.setItem("member_id",response?.data?.id||'')
      if (parameter?.setUserId) {
        parameter?.setUserId(response?.data?.id)
      

      }
      const successMessageColor = "#4285F4";
      const { status } = response;
      if (parameter?.navigate) {
        parameter?.navigate(`${parameter?.navUrl}`, {
          state: {
            successMessage: "Successfully Created!",
            successMessageColor,
            useracreate:parameter.useracreate,
            member_id:response?.data?.id
          },
        });
      }
      else {
        // window.location.reload();
      }
    })
    .catch((error) => {
      console.log("error:", error.response?.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce((acc, [field, messages]) => {
              if (Array.isArray(messages)) {
                // If messages is an array, join them and remove index prefixes like "0:"
                const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
                acc.push(` ${cleanedMessages.join(", ")}`);
              } else if (typeof messages === "string") {
                // If messages is a string, remove index prefix if present
                acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
              } else {
                // Handle unexpected data types
                acc.push(`${field}: Unknown error format`);
              }
              return acc;
            }, []);

            // Set errors in the state
            if (errors.length) {
              parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
            } else {
              parameter?.setErrors("Something went wrong. Please try again later.");
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          alert("Unauthorized access. Redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        parameter?.setErrors("No response received from the server. Please try again.");
      } else {
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(`An error occurred: ${error.message}`);
      }
    });
};
const justputDataWithoutToken = (parameter) => {


  axios
    .put(`${process.env.REACT_APP_API_URL}${parameter?.url}`, parameter?.payload)
    .then((response) => {
      if (parameter?.setUserId) {
        parameter?.setUserId(response?.data?.id)
      }
      const successMessageColor = "#4285F4";
      const { status } = response;
      if (parameter?.navigate) {
        parameter?.navigate(`${parameter?.navUrl}`, {
          state: {
            successMessage: "Successfully Created!",
            successMessageColor,
          },
        });
      }
      else {
        // window.location.reload();
      }
    })
    .catch((error) => {
      console.log("error:", error.response?.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce((acc, [field, messages]) => {
              if (Array.isArray(messages)) {
                // If messages is an array, join them and remove index prefixes like "0:"
                const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
                acc.push(` ${cleanedMessages.join(", ")}`);
              } else if (typeof messages === "string") {
                // If messages is a string, remove index prefix if present
                acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
              } else {
                // Handle unexpected data types
                acc.push(`${field}: Unknown error format`);
              }
              return acc;
            }, []);

            // Set errors in the state
            if (errors.length) {
              parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
            } else {
              parameter?.setErrors("Something went wrong. Please try again later.");
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          alert("Unauthorized access. Redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        parameter?.setErrors("No response received from the server. Please try again.");
      } else {
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(`An error occurred: ${error.message}`);
      }
    });
};

const justUpdateDataV2 = (parameter) => {
  const token = getToken();
  if (!getToken()) {
    console.error("JWT token not found in local storage");
    return;
  }

  axios
    .put(`${process.env.REACT_APP_API_URL}${parameter?.url}/`, parameter?.payload, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    .then(() => {
      parameter?.setMessage(true);
      if (parameter?.tofetch?.items && Array.isArray(parameter?.tofetch.items)) {
        parameter?.tofetch.items.forEach((item) => {
          if (item.fetchurl && item.setterFunction) {
            const parameter = {
              url: item.fetchurl,
              setterFunction: item.setterFunction,
              setErrors: item.setErrors
            }
            fetchDataV2(parameter);
          }
        });
      }
    })
    .catch((error) => {

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce((acc, [field, messages]) => {
              if (Array.isArray(messages)) {
                // If messages is an array, join them and remove index prefixes like "0:"
                const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
                acc.push(` ${cleanedMessages.join(", ")}`);
              } else if (typeof messages === "string") {
                // If messages is a string, remove index prefix if present
                acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
              } else {
                // Handle unexpected data types
                acc.push(`${field}: Unknown error format`);
              }
              return acc;
            }, []);

            // Set errors in the state
            if (errors.length) {
              parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
            } else {
              parameter?.setErrors("Something went wrong. Please try again later.");
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          alert("Unauthorized access. Redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        parameter?.setErrors("No response received from the server. Please try again.");
      } else {
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(`An error occurred: ${error.message}`);
      }
    });

};

const deleteDataV2 = (parameter) => {
  if (!getToken()) {
    console.error("JWT token not found in local storage");
    return Promise.resolve();
  }

  return axios
    .delete(`${process.env.REACT_APP_API_URL}${parameter?.url}/`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    .then((response) => {

      const successMessageColor = "#FFA2A2";
      parameter?.navigate(`${parameter?.navUrl}`, {
        state: {
          successMessage: "Successfully Deleted!",
          successMessageColor,
        },

      });

      if (response.status === 204) {
        return response.status;

      }
    })
    .catch((error) => {
      console.log("error:", error.response?.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce((acc, [field, messages]) => {
              if (Array.isArray(messages)) {
                // If messages is an array, join them and remove index prefixes like "0:"
                const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
                acc.push(` ${cleanedMessages.join(", ")}`);
              } else if (typeof messages === "string") {
                // If messages is a string, remove index prefix if present
                acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
              } else {
                // Handle unexpected data types
                acc.push(`${field}: Unknown error format`);
              }
              return acc;
            }, []);

            // Set errors in the state
            if (errors.length) {
              parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
            } else {
              parameter?.setErrors("Something went wrong. Please try again later.");
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          alert("Unauthorized access. Redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        parameter?.setErrors("No response received from the server. Please try again.");
      } else {
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(`An error occurred: ${error.message}`);
      }
    });
};

const fetchDataV2 = (parameter) => {
  // if (!token) return;
  axios
    .get(`${process.env.REACT_APP_API_URL}${parameter?.url}`, {
      headers: {
        // Authorization: `Bearer ${getToken()}`,
      },
    })
    .then((response) => {
      if (Array.isArray(response.data)) {
        parameter?.setterFunction(response.data);
      } else {
        parameter?.setterFunction(response.data);
      }

      if (response.status === 200) {
        return response.status;
      }
    })
    .catch((error) => {
      console.log("error:", error.response?.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce((acc, [field, messages]) => {
              if (Array.isArray(messages)) {
                // If messages is an array, join them and remove index prefixes like "0:"
                const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
                acc.push(` ${cleanedMessages.join(", ")}`);
              } else if (typeof messages === "string") {
                // If messages is a string, remove index prefix if present
                acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
              } else {
                // Handle unexpected data types
                acc.push(`${field}: Unknown error format`);
              }
              return acc;
            }, []);

            // Set errors in the state
            if (errors.length) {
              parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
            } else {
              parameter?.setErrors("Something went wrong. Please try again later.");
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          alert("Unauthorized access. Redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        parameter?.setErrors("No response received from the server. Please try again.");
      } else {
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(`An error occurred: ${error.message}`);
      }
    });
};


const fetchDataWithTokenV2 = (parameter) => {
  if (!getToken()) return;
  axios
    .get(`${process.env.REACT_APP_API_URL}${parameter?.url}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    .then((response) => {
      if (Array.isArray(response.data)) {
        parameter?.setterFunction(response.data);
      } else {
        parameter?.setterFunction(response.data);
      }

      if (response.status === 200) {
        return response.status;
      }
    })
    .catch((error) => {
      console.log("error:", error.response?.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce((acc, [field, messages]) => {
              if (Array.isArray(messages)) {
                // If messages is an array, join them and remove index prefixes like "0:"
                const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
                acc.push(` ${cleanedMessages.join(", ")}`);
              } else if (typeof messages === "string") {
                // If messages is a string, remove index prefix if present
                acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
              } else {
                // Handle unexpected data types
                acc.push(`${field}: Unknown error format`);
              }
              return acc;
            }, []);

            // Set errors in the state
            if (errors.length) {
              parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
            } else {
              parameter?.setErrors("Something went wrong. Please try again later.");
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          alert("Unauthorized access. Redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        parameter?.setErrors("No response received from the server. Please try again.");
      } else {
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(`An error occurred: ${error.message}`);
      }
    });
};

const fetchDataObjectV2 = (parameter) => {
  if (!getToken()) return; // If token doesn't exist, exit function

  parameter?.setLoading(true); // Set loading to true before API call

  axios
    .get(`${process.env.REACT_APP_API_URL}${parameter?.url}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    .then((response) => {
      // Check if response.data is an object
      if (typeof response.data === "object" && !Array.isArray(response.data)) {
        parameter?.setterFunction(response.data); // Directly set the object
      } else {
        parameter?.setErrors("Unexpected response data format.");
      }

      if (response.status === 200) {
        return response.status; // Return the status code
      }
    })
    .catch((error) => {
      console.log("error:", error.response?.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status >= 500) {
          if (data) {
            console.log("Handling error response data...");

            // Process and collect error messages
            const errors = Object.entries(data).reduce((acc, [field, messages]) => {
              if (Array.isArray(messages)) {
                // If messages is an array, join them and remove index prefixes like "0:"
                const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
                acc.push(` ${cleanedMessages.join(", ")}`);
              } else if (typeof messages === "string") {
                // If messages is a string, remove index prefix if present
                acc.push(` ${messages.replace(/^\d+:\s*/, "")}`);
              } else {
                // Handle unexpected data types
                acc.push(`${field}: Unknown error format`);
              }
              return acc;
            }, []);

            // Set errors in the state
            if (errors.length) {
              parameter?.setErrors(errors.join("\n")); // Pass errors as a joined string
            } else {
              parameter?.setErrors("Something went wrong. Please try again later.");
            }

            // Clear the errors after a delay (optional)
            setTimeout(() => {
              parameter?.setErrors(null);
            }, 5000);
          }
        } else if (status === 401) {
          alert("Unauthorized access. Redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
        }

        console.error("Response Status:", status);
        console.error("Response Data:", data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        parameter?.setErrors("No response received from the server. Please try again.");
      } else {
        console.error("Error setting up the request:", error.message);
        parameter?.setErrors(`An error occurred: ${error.message}`);
      }
    })
    .finally(() => {
      parameter?.setLoading(false); // Set loading to false after API call (both success and error cases)
    });
};


export {convertDateTime, fetchDataWithTokenV2, fetchDataV2, fetchDataObjectV2, postDataV2, updateDataV2, deleteDataV2, postDataWithoutToken, postDataReturnId, postDataReturnResponse, postDataWithFetchV2, updateDataReturnId, justpostDataWithoutToken, registration, justUpdateDataV2 ,ReturnResponseFormdataWithoutToken,ReturnPutResponseFormdataWithoutToken,putDataWithFetchV2,justputDataWithoutToken,updatePostDataReturnId};
