import {
    View,
    Text,
    TextInput,
    
} from 'react-native'

import {COLORS, SIZES, FONTS} from '../constants'

const  CustomTextInput = ({
    
    placeholder,
    inputStyle,
    value = "",
    
    onChange,
    secureTextEntry,
    keyboardType= "default",
    autoCompleteType= "off",
    autoCapitalize= "none",
    errorMsg="",
    multiline=false,
    maxLength

}) => {
    return (
        
                <TextInput 
                  style={inputStyle}
                  value={value}
                  placeholder={placeholder}
                  placeholderTextColor={COLORS.darkgray}
                  secureTextEntry={secureTextEntry}
                  keyboardType={keyboardType}
                  autoCompleteType={autoCompleteType}
                  autoCapitalize={autoCapitalize}
                  maxLength={maxLength}
                  onChangeText={(text) => onChange(text)}
                //   onContentSizeChange={(event) => {
                //     this.setState({height: event.nativeEvent.contentSize.height})
                //   }}

                  multiline={multiline}
                />
                  
               

           
    )
    

}

export default CustomTextInput;