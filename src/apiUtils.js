
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
      console.log("Full API response:", response.data);
      console.log("Available fields:", Object.keys(response.data));
      
      // Extract tokens from the correct API structure (updated for new backend)
      let token = response?.data?.tokens?.access || response?.data?.access_token || response?.data?.access || response?.data?.token || '';
      const refreshToken = response?.data?.tokens?.refresh || response?.data?.refresh_token || response?.data?.refresh || '';
      const userId = response?.data?.user?.id || response?.data?.id || response?.data?.user_id;
      const userName = `${response?.data?.user?.first_name || response?.data?.first_name ||''} ${response?.data?.user?.last_name || response?.data?.last_name ||""}` || "";
      
      // Debug: Log the API response structure
      console.log("🔍 API Response Structure Debug:");
      console.log("- Has tokens object:", !!response?.data?.tokens);
      console.log("- Has user object:", !!response?.data?.user);
      console.log("- Direct fields:", Object.keys(response?.data || {}));
      if (response?.data?.tokens) {
        console.log("- Tokens object keys:", Object.keys(response.data.tokens));
      }
      if (response?.data?.user) {
        console.log("- User object keys:", Object.keys(response.data.user));
      }
      
      // Check if we received proper JWT tokens
      if (!token) {
        console.error("❌ No JWT token received from API!");
        console.log("API Response:", response.data);
        console.log("Available fields:", Object.keys(response.data || {}));
      } else {
        console.log("✅ Received JWT token from API:", token.substring(0, 20) + "...");
      }
      
      // Debug: Check if userId is valid
      if (!userId) {
        console.error("No userId received from API response!");
        console.log("API Response data:", response.data);
        console.log("Available fields:", Object.keys(response.data || {}));
      }
      
      console.log("Storing token:", token);
      console.log("Storing userId:", userId);
      console.log("Storing userName:", userName);
      
      localStorage.setItem("token", token);
      localStorage.setItem("refresh", refreshToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("name", userName);
      
      // Store additional Google sign up data
      if (parameter?.payload?.is_google_signup) {
        localStorage.setItem("googleUserData", JSON.stringify({
          email: parameter.payload.email,
          contact_number: parameter.payload.contact_number,
          onbehalf: parameter.payload.onbehalf,
          gender: parameter.payload.gender,
          first_name: parameter.payload.first_name,
          last_name: parameter.payload.last_name,
          google_id: parameter.payload.google_id
        }));
        console.log("Stored Google user data in localStorage");
        
        // Check if we received proper JWT tokens from Google signup
        if (!token) {
          console.error("❌ No JWT token received from Google signup API!");
          console.log("API Response:", response.data);
        } else if (token.startsWith("google_")) {
          console.warn("⚠️ Google signup API returned temporary token instead of JWT. Backend needs to be updated.");
          console.log("Current token:", token);
        } else {
          console.log("✅ Received proper JWT token from Google signup:", token.substring(0, 20) + "...");
        }
      }
      
      console.log("Token stored in localStorage:", localStorage.getItem("token"));
      console.log("UserId stored in localStorage:", localStorage.getItem("userId"));

      // Show success message
      if (parameter?.showSuccessMessage) {
        parameter.showSuccessMessage("Successfully Created!");
      }

      // Navigate to the specified URL
      if (parameter?.navigate) {
        let navUrl = parameter?.navUrl;
        console.log("Original navUrl:", navUrl);
        console.log("User ID from response:", response?.data?.id || response?.data?.user_id);
        
        // Handle different registration types
        if (parameter?.navUrl?.includes('agentstepone')) {
          // Agent registration
          const agentUserId = response?.data?.id || response?.data?.user_id;
          navUrl = `/agentstepone/${agentUserId}`;
          console.log("Agent registration - Final navUrl:", navUrl);
        } else if (parameter?.navUrl?.includes('memstepone')) {
          // Google sign up or regular user registration - go to memstepone with user ID
          const userId = response?.data?.id || response?.data?.user_id || localStorage.getItem("userId");
          if (userId && userId !== 'undefined') {
            navUrl = `/memstepone/${userId}`;
            console.log("Google/User registration - Final navUrl:", navUrl);
          } else {
            console.error("No valid userId available for navigation!");
            navUrl = "/memstepone/"; // Fallback without user ID
            console.log("Using fallback navUrl:", navUrl);
          }
        } else if (parameter?.navUrl?.includes('newdashboard')) {
          // Regular dashboard
          navUrl = parameter?.navUrl;
          console.log("Dashboard - Final navUrl:", navUrl);
        }
        
        console.log("About to navigate to:", navUrl);
        
        // Small delay to ensure localStorage is set
        setTimeout(() => {
          parameter.navigate(navUrl, {
            state: {
              successMessage: "Successfully Created!",
              successMessageColor: "#4285F4",
            },
          });
          console.log("Navigation called successfully");
        }, 100);
      } else {
        console.log("No navigate function provided");
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
      const newMemberId = response?.data?.id || '';
      localStorage.setItem("member_id", newMemberId);
      
      if (parameter?.setUserId) {
        parameter?.setUserId(newMemberId);
      }
      
      const successMessageColor = "#4285F4";
      const { status } = response;
      
      if (parameter?.navigate) {
        // Replace userId in navUrl with new member_id for proper navigation
        let navUrl = parameter?.navUrl || '';
        // If navUrl contains /memsteptwo/ pattern, replace the ID with new member_id
        if (navUrl.includes('/memsteptwo/')) {
          navUrl = navUrl.replace(/\/memsteptwo\/\d+/, `/memsteptwo/${newMemberId}`);
        }
        
        parameter?.navigate(navUrl, {
          state: {
            successMessage: "Successfully Created!",
            successMessageColor,
            useracreate: parameter.useracreate,
            member_id: newMemberId,
            isNewMember: true
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

// Google OAuth Login Function
const googleLogin = (parameter) => {
  axios
    .post(`${process.env.REACT_APP_API_URL}${parameter?.url}`, parameter?.payload, {})
    .then((response) => {
      console.log("Google login response:", response.data);
      
      // Store tokens and user data
      console.log("Google login response structure:", response.data);
      console.log("Available fields in Google login response:", Object.keys(response.data || {}));
      
      // Extract tokens from the correct structure (updated for new backend)
      const access = response.data.tokens?.access || response.data.access;
      const refresh = response.data.tokens?.refresh || response.data.refresh;
      const userId = response.data.user?.id || response.data.user_id || response.data.id;
      const userName = `${response.data.user?.first_name || response.data.first_name || ''} ${response.data.user?.last_name || response.data.last_name || ''}` || "";
      const profileCompleted = response.data.user?.profile_completed || response.data.profile_completed;
      const profilePercentage = response.data.user?.profile_percentage || response.data.profile_percentage;
      
      // Debug: Log the API response structure
      console.log("🔍 Google Login API Response Structure Debug:");
      console.log("- Has tokens object:", !!response.data.tokens);
      console.log("- Has user object:", !!response.data.user);
      console.log("- Direct fields:", Object.keys(response.data || {}));
      if (response.data.tokens) {
        console.log("- Tokens object keys:", Object.keys(response.data.tokens));
      }
      if (response.data.user) {
        console.log("- User object keys:", Object.keys(response.data.user));
      }
      
      console.log("Google login - Access token:", access);
      console.log("Google login - Refresh token:", refresh);
      console.log("Google login - User ID:", userId);
      console.log("Google login - Profile completed:", profileCompleted);
      console.log("Google login - Profile percentage:", profilePercentage);
      
      // Check if access token exists
      if (!access) {
        console.error("No access token received from Google login API!");
        console.log("Response data keys:", Object.keys(response.data || {}));
        console.log("Full response data:", response.data);
      } else {
        console.log("Access token received, storing in localStorage");
      }
      
      localStorage.setItem("token", access || '');
      localStorage.setItem("refresh", refresh || '');
      localStorage.setItem("userId", userId || '');
      localStorage.setItem("name", userName);
      localStorage.setItem("loginTime", new Date().toISOString());
      
      // Verify token was stored
      console.log("Token stored in localStorage:", localStorage.getItem("token"));
      console.log("Token length after storage:", localStorage.getItem("token")?.length);
      
      // Check token format
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        console.log("Token format check:");
        console.log("- Starts with 'eyJ':", storedToken.startsWith("eyJ"));
        console.log("- Contains dots:", storedToken.includes("."));
        console.log("- Split by dots:", storedToken.split(".").length);
        console.log("- First part (header):", storedToken.split(".")[0]);
        console.log("- Second part (payload):", storedToken.split(".")[1]);
        console.log("- Third part (signature):", storedToken.split(".")[2]);
      }
      
      // Show success message
      if (parameter?.showSuccessMessage) {
        parameter.showSuccessMessage("Successfully logged in with Google!");
      }
      
      // Navigate based on role and profile completion status
      if (parameter?.navigate) {
        let navUrl;
        const userRole = response.data.user?.role || response.data.role || localStorage.getItem("role");
        
        if (userRole === 'agent') {
          // Agent login - go to agent dashboard
          navUrl = "/newdashboard";
          console.log("Google login - Agent role detected, navigating to agent dashboard");
        } else {
          // User login - check profile completion
          if (profileCompleted === true) {
            // Profile is complete, go to user dashboard
          navUrl = "/newdashboard";
          console.log("Profile complete - navigating to dashboard");
        } else {
          // Profile incomplete, go to MemStepOne
          navUrl = `/memstepone/${userId}`;
          console.log("Profile incomplete - navigating to MemStepOne");
          }
        }
        
        parameter.navigate(navUrl, {
          state: {
            successMessage: "Successfully logged in with Google!",
            successMessageColor: "#4285F4",
          },
        });
      }
    })
    .catch((error) => {
      console.log("Google login error:", error.response?.data);
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400 || status >= 500) {
          if (data) {
            // Process and collect error messages
            const errors = Object.entries(data).reduce((acc, [field, messages]) => {
              if (Array.isArray(messages)) {
                const cleanedMessages = messages.map((msg) => msg.replace(/^\d+:\s*/, ""));
                acc.push(`${field}: ${cleanedMessages.join(", ")}`);
              } else if (typeof messages === "string") {
                acc.push(`${field}: ${messages.replace(/^\d+:\s*/, "")}`);
              } else {
                acc.push(`${field}: Unknown error format`);
              }
              return acc;
            }, []);
            
            const errorMessage = errors.join("\n");
            parameter?.setErrors(errorMessage);
            if (parameter?.showErrorMessage) {
              parameter.showErrorMessage(errorMessage);
            }
          }
        } else if (status === 401) {
          const unauthorizedMessage = "Unauthorized access. Please try again.";
          alert(unauthorizedMessage);
          parameter?.setErrors(unauthorizedMessage);
          if (parameter?.showErrorMessage) {
            parameter.showErrorMessage(unauthorizedMessage);
          }
        }
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
      // Check if response.data is an object or array
      if (typeof response.data === "object") {
        // Handle both objects and arrays
        parameter?.setterFunction(response.data);
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


export {convertDateTime, fetchDataWithTokenV2, fetchDataV2, fetchDataObjectV2, postDataV2, updateDataV2, deleteDataV2, postDataWithoutToken, postDataReturnId, postDataReturnResponse, postDataWithFetchV2, updateDataReturnId, justpostDataWithoutToken, registration, justUpdateDataV2 ,ReturnResponseFormdataWithoutToken,ReturnPutResponseFormdataWithoutToken,putDataWithFetchV2,justputDataWithoutToken,updatePostDataReturnId, googleLogin};
