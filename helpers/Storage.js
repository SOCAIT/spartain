import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";

      function save(key, value) {
        
          // For storing key
          RNSecureKeyStore.set(key, value, {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY})
          .then((res) => {
             console.log(res);
           }, (err) => {
             console.log(err);
           });
      }
      
      const getValueFor = (key,set) => {
        RNSecureKeyStore.get(key)
          .then((value) => {
            set(
              value
            );
          })
          .catch(console.error);
      }

      const deleteToken = () =>{
           // For removing key
        RNSecureKeyStore.remove("key1")
          .then((res) => {
              console.log(res);
          }, (err) => {
              console.log(err);
          });
      }
      
export {save, getValueFor,deleteToken}
