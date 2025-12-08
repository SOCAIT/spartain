import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useState, useEffect } from "react";
import axios from "axios";
import { backend_url } from '../../config/config';
import { COLORS, SIZES, FONTS } from "../../constants"
import { useForm, Controller } from 'react-hook-form'

export default function ForgotPasswordScreen({navigation}) {

  const { control, handleSubmit, formState: { errors }, watch } = useForm({ mode: 'onBlur' });

  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Reset password, 4: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(otpTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Step 1: Request Password Reset (Send OTP)
  const requestPasswordReset = async () => {
    setLoading(true);
    setErrorMessage("");
    setStatusMessage("Sending verification code...");

    try {
      if (!email.trim()) {
        setErrorMessage("Please enter your email address");
        setLoading(false);
        return;
      }

      const response = await axios.post(backend_url + "auth/forgot-password/", {
        email: email.trim()
      });

      if (response.data.error) {
        setErrorMessage(response.data.error);
      } else {
        setSuccessMessage("Verification code sent to your email!");
        setOtpSent(true);
        setOtpTimer(300); // 5 minutes
        setStep(2);
        setStatusMessage("");
      }
    } catch (error) {
      console.log(error.toJSON ? error.toJSON() : error);
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Failed to send verification code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const verifyOTP = async () => {
    setLoading(true);
    setErrorMessage("");
    setStatusMessage("Verifying code...");

    try {
      if (!otp.trim()) {
        setErrorMessage("Please enter the verification code");
        setLoading(false);
        return;
      }

      const response = await axios.post(backend_url + "user/verify-otp/", {
        email: email.trim(),
        otp: otp.trim()
      });

      if (response.data.error) {
        setErrorMessage(response.data.error);
      } else {
        setSuccessMessage("Code verified successfully!");
        setStep(3);
        setStatusMessage("");
      }
    } catch (error) {
      console.log(error.toJSON ? error.toJSON() : error);
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Invalid verification code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const resetPassword = async () => {
    setLoading(true);
    setErrorMessage("");
    setStatusMessage("Resetting password...");

    try {
      if (!newPassword.trim()) {
        setErrorMessage("Please enter a new password");
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        setLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        setErrorMessage("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      const response = await axios.post(backend_url + "user/reset-password/", {
        email: email.trim(),
        otp: otp.trim(),
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      if (response.data.error) {
        setErrorMessage(response.data.error);
      } else {
        setSuccessMessage("Password reset successfully!");
        setStep(4);
        setStatusMessage("");
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      }
    } catch (error) {
      console.log(error.toJSON ? error.toJSON() : error);
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrorMessage("");
      setSuccessMessage("");
      setStatusMessage("");
    } else {
      navigation.goBack();
    }
  };

  const resendOTP = () => {
    if (otpTimer === 0) {
      requestPasswordReset();
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.overlay} />

      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" size={24} color="#FF6A00" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Icon name="lock" size={60} color="#FF6A00" />
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            {step === 1 && "Enter your email to receive a verification code"}
            {step === 2 && "Enter the verification code sent to your email"}
            {step === 3 && "Create a new password"}
            {step === 4 && "Password reset successfully!"}
          </Text>
        </View>

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <>
            <View style={styles.inputContainer}>
              <Icon name="envelope" size={20} color="#FF6A00" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={"#aaa"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {successMessage ? (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            <View style={{ margin: SIZES.padding * 4 }}>
              <TouchableOpacity
                style={[styles.button, loading && { backgroundColor: COLORS.lightGray5, opacity: 0.7 }]}
                onPress={requestPasswordReset}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ActivityIndicator color={COLORS.white} style={{ marginRight: 10 }} />
                    <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Sending...</Text>
                  </>
                ) : (
                  <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Send Verification Code</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 2 && (
          <>
            <View style={styles.inputContainer}>
              <Icon name="hashtag" size={20} color="#FF6A00" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit code"
                placeholderTextColor={"#aaa"}
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
                editable={!loading}
              />
            </View>

            <Text style={styles.otpInfo}>
              Code expires in: <Text style={{ color: otpTimer > 60 ? '#FFF' : '#FF6A00' }}>{Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}</Text>
            </Text>

            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {successMessage ? (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            <View style={{ margin: SIZES.padding * 4 }}>
              <TouchableOpacity
                style={[styles.button, loading && { backgroundColor: COLORS.lightGray5, opacity: 0.7 }]}
                onPress={verifyOTP}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ActivityIndicator color={COLORS.white} style={{ marginRight: 10 }} />
                    <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Verifying...</Text>
                  </>
                ) : (
                  <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Verify Code</Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.resendContainer}
              onPress={resendOTP}
              disabled={otpTimer > 0}
            >
              <Text style={[styles.resendText, otpTimer > 0 && { color: '#999' }]}>
                {otpTimer > 0 ? `Resend code in ${otpTimer}s` : "Didn't receive the code? Resend"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <>
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#FF6A00" style={styles.icon} />
              <TextInput
                style={styles.input}
                secureTextEntry={!showPassword}
                placeholder="New password"
                placeholderTextColor={"#aaa"}
                value={newPassword}
                onChangeText={setNewPassword}
                editable={!loading}
              />
              <MaterialIcons 
                name={showPassword ? "visibility" : "visibility-off"} 
                size={20} 
                color="#FF6A00" 
                style={styles.iconRight}
                onPress={() => setShowPassword(!showPassword)} 
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#FF6A00" style={styles.icon} />
              <TextInput
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                placeholder="Confirm password"
                placeholderTextColor={"#aaa"}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />
              <MaterialIcons 
                name={showConfirmPassword ? "visibility" : "visibility-off"} 
                size={20} 
                color="#FF6A00" 
                style={styles.iconRight}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
              />
            </View>

            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <View style={{ margin: SIZES.padding * 4 }}>
              <TouchableOpacity
                style={[styles.button, loading && { backgroundColor: COLORS.lightGray5, opacity: 0.7 }]}
                onPress={resetPassword}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ActivityIndicator color={COLORS.white} style={{ marginRight: 10 }} />
                    <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Resetting...</Text>
                  </>
                ) : (
                  <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Reset Password</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <View style={styles.successView}>
            <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
            <Text style={styles.successTitle}>Success!</Text>
            <Text style={styles.successSubtitle}>Your password has been reset successfully.</Text>
            <Text style={styles.redirectText}>Redirecting to login...</Text>
          </View>
        )}

        {/* Back to Login */}
        {step < 4 && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:{
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 45 : 0,
    backgroundColor: COLORS.primary
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subtitle: {
    color: '#CCC',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFF',
    height: 40,
  },
  iconRight: {
    marginLeft: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6A00',
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: 'red',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
  },
  errorText: {
    color: '#FF6B6B',
    ...FONTS.body4,
  },
  successContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
  },
  successText: {
    color: '#4CAF50',
    ...FONTS.body4,
  },
  otpInfo: {
    color: '#CCC',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  resendText: {
    color: '#FF6A00',
    fontSize: 14,
    fontWeight: '600',
  },
  successView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  successTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  successSubtitle: {
    color: '#CCC',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  redirectText: {
    color: '#FF6A00',
    fontSize: 12,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  footerText: {
    color: '#CCC',
  },
  linkText: {
    color: '#FF6A00',
    fontWeight: 'bold',
  },
});

