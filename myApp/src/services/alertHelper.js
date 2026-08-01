import { Alert, Platform } from 'react-native';

/**
 * Cross-platform alert helper.
 *
 * On native (iOS / Android): delegates to Alert.alert — a native dialog with
 * full button support, styles, and cancel handling.
 *
 * On web: Alert.alert has no UI implementation in react-native-web, so this
 * helper falls back to window.alert (a blocking browser dialog). If buttons
 * are provided, the first button's onPress callback is invoked after the user
 * dismisses the alert, mimicking the native "OK" behaviour.
 *
 * @param {string} title               - Alert title
 * @param {string} [message]           - Alert message body
 * @param {Array}  [buttons]           - Optional buttons array (same format as Alert.alert)
 * @param {string} [buttons[].text]    - Button label
 * @param {Function} [buttons[].onPress] - Callback when button is pressed
 * @param {string} [buttons[].style]   - 'cancel' | 'default' | 'destructive'
 */
export function showAlert(title, message, buttons) {
  if (Platform.OS === 'web') {
    // window.alert is blocking — code after it won't run until the user dismisses.
    const alertMessage = message || title;
    window.alert(alertMessage);
    // If buttons were provided, invoke the first button's onPress (mimics "OK").
    if (buttons && buttons.length > 0 && buttons[0].onPress) {
      buttons[0].onPress();
    }
    return;
  }
  // Native: use the full Alert.alert API.
  Alert.alert(title, message, buttons);
}

/**
 * Convenience wrapper for API / network errors.
 *
 * Detects network-level failures (TypeError thrown by fetch when the host is
 * unreachable) and surfaces a clear, user-friendly message instead of the
 * generic "Something went wrong."
 *
 * @param {Error}  err                - The caught error
 * @param {string} [fallbackTitle]    - Title to show (default: 'Error')
 * @param {string} [fallbackMessage]  - Fallback message if err has no message
 */
export function showError(err, fallbackTitle = 'Error', fallbackMessage = 'Something went wrong.') {
  const isNetworkError = err instanceof TypeError;
  const message = isNetworkError
    ? "Can't reach the server. Check your connection."
    : (err?.message || fallbackMessage);
  showAlert(fallbackTitle, message);
}
