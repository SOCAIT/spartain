// import React, { useEffect, useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   ActivityIndicator,
//   ImageBackground,
// } from "react-native";
// import {
//   CompletedDownloadingFile,
//   DownloadingError,
//   PassioSDK,
// } from "@passiolife/nutritionai-react-native-sdk-v3";
// // import { QuickStartGuide } from "./QuickStartGuide";
//         // import { PASSIO_KEY } from '@env';
// const PASSIO_KEY='dmzZvqIVJWbxSrIQZ7jQqQSuou7Kg6Qt0wLApBN1'
// export type SDKStatus = 'init' | 'downloading' | 'error' | 'ready'

// export const PassioConfigurationView = () => {
//   const [sdkStatus, setSDKStatus] = useState<SDKStatus>("init");
//   const [leftFile, setDownloadingLeft] = useState<number | null>(null);
                                           
//   useEffect(() => {
//     async function configure() {
//       try {
//         // const status = await PassioSDK.configure({
//         //   key: PASSIO_KEY,
//         //   debugMode: true,
//         //   autoUpdate: true,
//         // });

//         const status = {
//           mode: "isReadyForDetection",
//           errorMessage: "No error",
//         };
//         switch (status.mode) {
//           case "notReady":
//             return;
//           case "isReadyForDetection":
//             setSDKStatus("ready");
//             return;
//           case "error":
//             console.error(`PassioSDK Error ${status.errorMessage}`);
//             setSDKStatus("error");
//             return;
//         }
//       } catch (err) {
//         console.error(`PassioSDK Error ${err}`);
//         setSDKStatus("error");
//       }
//     }
//     configure();
//   }, []);

// //   useEffect(() => {
// //     const callBacks = PassioSDK.onDownloadingPassioModelCallBacks({
// //       completedDownloadingFile: ({ filesLeft }: CompletedDownloadingFile) => {
// //         setDownloadingLeft(filesLeft);
// //       },
// //       downloadingError: ({ message }: DownloadingError) => {
// //         console.log("DownloadingError ===>", message);
// //       },
// //     });
// //     return () => callBacks.remove();
// //   }, []);

//   return (
//     <ImageBackground
//       source={require("../../assets/images/onboarding/intro.jpg")}
//       style={styles.container}
//     >
//       {(() => {
//         switch (sdkStatus) {
//           case "ready":
//             return <View style={styles.middle}><Text>Ready</Text></View>;

//           case "error":
//             return (
//               <View style={styles.middle}>
//                 <Text>SDK is Error</Text>
//               </View>
//             );

//           default:
//             return (
//               <View style={styles.middle}>
//                 <ActivityIndicator size={20} color={"white"} />
//                 {leftFile !== null && (
//                   <Text>{`Downloading file left ${leftFile}`}</Text>
//                 )}
//               </View>
//             );
//         }
//       })()}
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   middle: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     justifyContent: "center",
//     alignItems: "center",
//     alignSelf: "center",
//   },
// });