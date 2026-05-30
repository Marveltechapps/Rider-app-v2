/**
 * Generic FAQ Screen Component
 * Displays FAQ questions and answers for all help topics
 */

import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import Header from '../components/layout/Header';
import ChevronDownIcon from '../components/icons/ChevronRightIcon';
import paymentFAQStyles from '../styles/paymentFAQStyles';
import { scale, verticalScale } from '../utils/responsive';
import { getFaqByKey } from '../api/content';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: { [key: string]: { title: string; faqs: FAQ[] } } = {
  // Delivery Issues FAQs
  'delivery-faq-customer-not-available': {
    title: 'Customer Not Available',
    faqs: [
      {
        id: '1',
        question: 'What should I do if the customer is not available?',
        answer: 'If the customer is not available:\n\n1. Call the customer using the in-app call button\n2. Wait at the location for 5-10 minutes\n3. If still unavailable, mark as "Customer Not Available"\n4. Take a photo of the delivery location\n5. Return the order to the restaurant/store\n\nYou will receive payment for the attempt, but the order will be cancelled.',
      },
      {
        id: '2',
        question: 'Will I get paid if customer is not available?',
        answer: 'Yes, you will receive payment for the delivery attempt:\n\n• Base delivery fee (50% of normal fee)\n• Distance traveled compensation\n• Time compensation\n\nThe full delivery fee is only paid when the order is successfully delivered.',
      },
      {
        id: '3',
        question: 'How long should I wait for the customer?',
        answer: 'Recommended waiting time:\n\n• Minimum: 5 minutes\n• Maximum: 10 minutes\n• After 10 minutes, mark as unavailable\n\nAlways try calling the customer first before marking as unavailable.',
      },
      {
        id: '4',
        question: 'What if customer asks me to leave the order?',
        answer: 'You can leave the order ONLY if:\n\n1. Customer explicitly requests it\n2. Location is safe and secure\n3. You take a clear photo of the delivery location\n4. You mark it as "Left at Door" in the app\n\nNote: Leaving orders without customer confirmation may result in complaints.',
      },
    ],
  },
  'delivery-faq-wrong-address': {
    title: 'Wrong Address',
    faqs: [
      {
        id: '1',
        question: 'What if the delivery address is incorrect?',
        answer: 'If the address is wrong:\n\n1. Call the customer to confirm the correct address\n2. If customer provides new address:\n   - Update in app (if nearby)\n   - Deliver to new location\n   - You\'ll receive extra distance compensation\n3. If customer doesn\'t respond:\n   - Mark as "Wrong Address"\n   - Return order to restaurant\n   - You\'ll receive attempt payment',
      },
      {
        id: '2',
        question: 'Will I get extra payment for wrong address?',
        answer: 'Yes, you receive compensation:\n\n• If you deliver to corrected address:\n  - Full delivery fee\n  - Extra distance compensation\n  - Time compensation\n\n• If order is cancelled:\n  - Base attempt fee (50%)\n  - Distance compensation',
      },
      {
        id: '3',
        question: 'What if the address doesn\'t exist?',
        answer: 'If address doesn\'t exist:\n\n1. Call customer immediately\n2. Ask for landmarks or nearby locations\n3. Use GPS to find closest match\n4. If unable to locate, mark as "Address Not Found"\n5. Return order and contact support\n\nYou\'ll receive attempt payment and support will investigate.',
      },
      {
        id: '4',
        question: 'Can I cancel if address is too far?',
        answer: 'You can cancel if:\n\n• New address is more than 5km from original\n• Customer refuses to pay extra charges\n• Location is unsafe or inaccessible\n\nAlways contact support before cancelling. Unauthorized cancellations may affect your rating.',
      },
    ],
  },
  'delivery-faq-cancellation': {
    title: 'Order Cancellation',
    faqs: [
      {
        id: '1',
        question: 'When can I cancel an order?',
        answer: 'You can cancel an order if:\n\n• Customer is not available after waiting\n• Wrong address and customer unresponsive\n• Restaurant/store is closed\n• Order is damaged or incorrect\n• Unsafe delivery location\n• Customer cancels before pickup\n\nAlways try to contact customer/support before cancelling.',
      },
      {
        id: '2',
        question: 'Will I be charged for cancelling?',
        answer: 'Cancellation charges depend on the reason:\n\n• No charge if:\n  - Customer cancelled\n  - Restaurant/store issue\n  - App/system error\n  - Valid safety concern\n\n• May be charged if:\n  - Cancelled without valid reason\n  - Repeated cancellations\n  - Customer complaint',
      },
      {
        id: '3',
        question: 'What happens to my payment if I cancel?',
        answer: 'Payment for cancelled orders:\n\n• You receive attempt fee (50% of delivery fee)\n• Distance compensation (if you traveled)\n• Time compensation (if you waited)\n\nFull payment is only for successful deliveries.',
      },
      {
        id: '4',
        question: 'How do I cancel an order?',
        answer: 'To cancel an order:\n\n1. Open the order details\n2. Tap "Cancel Order"\n3. Select cancellation reason\n4. Add notes if needed\n5. Confirm cancellation\n\nAlways provide accurate reason. False reasons may result in penalties.',
      },
    ],
  },
  'delivery-faq-delays': {
    title: 'Delivery Delays',
    faqs: [
      {
        id: '1',
        question: 'What if I\'m running late for delivery?',
        answer: 'If you\'re running late:\n\n1. Contact customer immediately\n2. Explain the delay (traffic, weather, etc.)\n3. Provide updated ETA\n4. If delay is significant (>30 min), contact support\n\nLate deliveries may affect your rating, but communication helps.',
      },
      {
        id: '2',
        question: 'Will I be penalized for late deliveries?',
        answer: 'Penalties depend on:\n\n• Frequency: Occasional delays are okay\n• Communication: Informing customer helps\n• Reason: Valid reasons (traffic, weather) are acceptable\n\nRepeated late deliveries without communication may:\n• Lower your rating\n• Reduce order priority\n• Require support intervention',
      },
      {
        id: '3',
        question: 'What if restaurant is taking too long?',
        answer: 'If restaurant delay:\n\n1. Inform customer about the delay\n2. Contact restaurant to check status\n3. If delay >15 minutes, contact support\n4. You won\'t be penalized for restaurant delays\n\nAlways keep customer informed to avoid complaints.',
      },
      {
        id: '4',
        question: 'How can I avoid delivery delays?',
        answer: 'Tips to avoid delays:\n\n• Check traffic before accepting order\n• Plan your route efficiently\n• Start moving immediately after pickup\n• Keep phone charged and GPS on\n• Avoid accepting orders if you\'re far away\n• Communicate proactively with customers',
      },
    ],
  },
  'delivery-faq-damaged-items': {
    title: 'Damaged or Missing Items',
    faqs: [
      {
        id: '1',
        question: 'What if the order is damaged?',
        answer: 'If order is damaged:\n\n1. Check damage at pickup (before leaving restaurant)\n2. If damaged, inform restaurant immediately\n3. Don\'t accept damaged orders\n4. If damage occurs during delivery:\n   - Take photos\n   - Inform customer\n   - Contact support\n\nYou won\'t be penalized if damage is from restaurant.',
      },
      {
        id: '2',
        question: 'What if items are missing from the order?',
        answer: 'If items are missing:\n\n1. Check order at pickup\n2. If missing, ask restaurant to add items\n3. If discovered later:\n   - Contact customer\n   - Apologize and explain\n   - Contact support for resolution\n\nMissing items are usually restaurant\'s responsibility.',
      },
      {
        id: '3',
        question: 'Will I be charged for damaged/missing items?',
        answer: 'You won\'t be charged if:\n\n• Damage/missing items are from restaurant\n• You reported the issue immediately\n• You have proof (photos, messages)\n• It\'s clearly not your fault\n\nYou may be responsible if:\n• You caused the damage\n• You didn\'t check order at pickup\n• You delivered to wrong address',
      },
      {
        id: '4',
        question: 'How do I prevent damaged deliveries?',
        answer: 'Best practices:\n\n• Handle orders carefully\n• Use proper storage (hot bags, secure mounting)\n• Check order completeness at pickup\n• Take photos if order looks damaged\n• Drive carefully, especially with fragile items\n• Keep orders secure during transport',
      },
    ],
  },
  // Account & Documents FAQs
  'account-faq-profile-verification': {
    title: 'Profile Verification',
    faqs: [
      {
        id: '1',
        question: 'How do I verify my profile?',
        answer: 'To verify your profile:\n\n1. Go to Profile > Edit Profile\n2. Upload clear profile photo\n3. Complete all required information\n4. Submit for verification\n5. Wait for approval (usually 24-48 hours)\n\nVerified profiles get priority for orders and better features.',
      },
      {
        id: '2',
        question: 'Why is my profile verification pending?',
        answer: 'Verification may be pending due to:\n\n• Incomplete information\n• Unclear or incorrect documents\n• Photo doesn\'t match documents\n• System processing delay\n\nCheck your email for verification status or contact support.',
      },
      {
        id: '3',
        question: 'What documents are needed for verification?',
        answer: 'Required documents:\n\n• Aadhar Card (mandatory)\n• PAN Card (mandatory)\n• Driving License (mandatory)\n• Profile Photo (clear, recent)\n• Vehicle RC (if applicable)\n• Vehicle Insurance (if applicable)\n\nAll documents must be clear, valid, and match your profile.',
      },
      {
        id: '4',
        question: 'How long does verification take?',
        answer: 'Verification timeline:\n\n• Initial review: 24-48 hours\n• Document verification: 2-3 business days\n• Complete verification: 3-5 business days\n\nYou\'ll receive email notifications at each step. Contact support if it takes longer.',
      },
    ],
  },
  'account-faq-kyc-documents': {
    title: 'KYC Documents',
    faqs: [
      {
        id: '1',
        question: 'How do I upload KYC documents?',
        answer: 'To upload KYC documents:\n\n1. Go to Profile > My Documents\n2. Select the document type\n3. Take clear photo or choose from gallery\n4. Enter document number\n5. Submit for verification\n\nEnsure photos are:\n• Clear and readable\n• All corners visible\n• Good lighting\n• No glare or shadows',
      },
      {
        id: '2',
        question: 'What if my document is rejected?',
        answer: 'If document is rejected:\n\n1. Check rejection reason in email/app\n2. Common reasons:\n   - Unclear photo\n   - Expired document\n   - Name mismatch\n   - Wrong document type\n3. Upload corrected document\n4. Contact support if issue persists\n\nYou can resubmit documents immediately after rejection.',
      },
      {
        id: '3',
        question: 'Can I update my documents?',
        answer: 'Yes, you can update documents:\n\n1. Go to My Documents\n2. Click on the document card\n3. Select "Change" button\n4. Upload new document\n5. Submit for verification\n\nUpdated documents go through verification again (24-48 hours).',
      },
      {
        id: '4',
        question: 'What if my document expires?',
        answer: 'If document expires:\n\n1. You\'ll receive notification before expiry\n2. Upload renewed document immediately\n3. Your account remains active during renewal\n4. Verification takes 24-48 hours\n\nExpired documents may restrict some features until renewed.',
      },
    ],
  },
  'account-faq-suspension': {
    title: 'Account Suspension',
    faqs: [
      {
        id: '1',
        question: 'Why was my account suspended?',
        answer: 'Common suspension reasons:\n\n• Violation of terms of service\n• Multiple customer complaints\n• Fraudulent activity\n• Document verification failure\n• Safety violations\n• Repeated cancellations\n\nYou\'ll receive email with specific reason and steps to resolve.',
      },
      {
        id: '2',
        question: 'How do I reactivate my account?',
        answer: 'To reactivate account:\n\n1. Check suspension email for requirements\n2. Resolve the issue (upload documents, respond to complaints, etc.)\n3. Submit reactivation request\n4. Wait for review (3-5 business days)\n5. Contact support if needed\n\nReactivation depends on resolving the suspension reason.',
      },
      {
        id: '3',
        question: 'How long does suspension last?',
        answer: 'Suspension duration:\n\n• Temporary: 1-7 days (minor violations)\n• Extended: 7-30 days (serious violations)\n• Permanent: For severe violations\n\nDuration depends on:\n• Type of violation\n• Your response\n• Resolution of issues\n\nCheck your email for specific timeline.',
      },
      {
        id: '4',
        question: 'Can I appeal a suspension?',
        answer: 'Yes, you can appeal:\n\n1. Contact support within 7 days\n2. Provide explanation and evidence\n3. Include order IDs, screenshots, etc.\n4. Wait for review (5-7 business days)\n\nAppeals are reviewed by a human team. Be honest and provide all relevant information.',
      },
    ],
  },
  'account-faq-update-profile': {
    title: 'Update Profile',
    faqs: [
      {
        id: '1',
        question: 'How do I change my profile information?',
        answer: 'To update profile:\n\n1. Go to Profile > Edit Profile\n2. Update any field:\n   - Name\n   - Phone number\n   - Email\n   - Profile photo\n3. Tap "Save Changes"\n\nSome changes (phone, email) may require verification.',
      },
      {
        id: '2',
        question: 'Can I change my phone number?',
        answer: 'Yes, but it requires verification:\n\n1. Go to Edit Profile\n2. Change phone number\n3. Verify new number via OTP\n4. Old number will be unlinked\n\nImportant: Make sure you have access to the new number for OTP.',
      },
      {
        id: '3',
        question: 'How do I change my profile photo?',
        answer: 'To change profile photo:\n\n1. Go to Edit Profile\n2. Tap on profile photo\n3. Choose:\n   - Take Photo\n   - Choose from Gallery\n4. Crop and adjust if needed\n5. Save changes\n\nPhoto should be:\n• Clear and recent\n• Your face clearly visible\n• Good lighting\n• Professional appearance',
      },
      {
        id: '4',
        question: 'What information can\'t I change?',
        answer: 'Information you cannot change:\n\n• Rider ID (permanent)\n• Date of birth (requires support)\n• Document numbers (requires re-verification)\n• Account creation date\n\nFor changes to restricted fields, contact support with valid reason and documents.',
      },
    ],
  },
  // App Issues FAQs
  'app-faq-login': {
    title: 'Login Problems',
    faqs: [
      {
        id: '1',
        question: 'I forgot my password. How do I reset it?',
        answer: 'To reset password:\n\n1. On login screen, tap "Forgot Password"\n2. Enter your registered phone number\n3. Receive OTP via SMS\n4. Enter OTP and set new password\n5. Login with new password\n\nIf you don\'t receive OTP, check:\n• Phone number is correct\n• SMS permissions enabled\n• Network connection',
      },
      {
        id: '2',
        question: 'I\'m not receiving OTP. What should I do?',
        answer: 'If OTP not received:\n\n1. Check phone number is correct\n2. Wait 60 seconds and request again\n3. Check SMS permissions in phone settings\n4. Ensure good network connection\n5. Check spam/junk folder\n6. Contact support if issue persists\n\nOTP is valid for 5 minutes. Don\'t request multiple times quickly.',
      },
      {
        id: '3',
        question: 'My account is locked. How do I unlock it?',
        answer: 'If account is locked:\n\n1. Wait 30 minutes (automatic unlock)\n2. Try logging in again\n3. If still locked:\n   - Contact support\n   - Provide your rider ID\n   - Verify your identity\n\nAccount locks after 5 failed login attempts for security.',
      },
      {
        id: '4',
        question: 'I can\'t login with my phone number',
        answer: 'Troubleshooting steps:\n\n1. Verify phone number is registered\n2. Check if account exists (contact support)\n3. Ensure correct country code (+91 for India)\n4. Try "Forgot Password" to reset\n5. Clear app cache and restart\n6. Update app to latest version\n\nIf nothing works, contact support with your rider ID.',
      },
    ],
  },
  'app-faq-crashes': {
    title: 'App Crashes & Bugs',
    faqs: [
      {
        id: '1',
        question: 'The app keeps crashing. What should I do?',
        answer: 'To fix app crashes:\n\n1. Close and restart the app\n2. Clear app cache:\n   - Android: Settings > Apps > QuickRider > Clear Cache\n   - iOS: Delete and reinstall app\n3. Update to latest version\n4. Restart your phone\n5. Check available storage space\n6. Contact support if issue persists\n\nProvide crash details (when it happens, what you were doing) to support.',
      },
      {
        id: '2',
        question: 'The app is freezing or slow',
        answer: 'To improve app performance:\n\n1. Close other apps running in background\n2. Clear app cache and data\n3. Update app to latest version\n4. Restart your phone\n5. Check internet connection\n6. Free up phone storage (need at least 1GB free)\n7. Update phone OS if available\n\nIf still slow, contact support with device model and OS version.',
      },
      {
        id: '3',
        question: 'GPS is not working in the app',
        answer: 'To fix GPS issues:\n\n1. Enable Location Services:\n   - Android: Settings > Location > On\n   - iOS: Settings > Privacy > Location Services\n2. Set app location permission to "Always"\n3. Enable GPS in phone settings\n4. Restart app\n5. Go to open area (better GPS signal)\n6. Restart phone if needed\n\nGPS is essential for deliveries. Contact support if GPS still doesn\'t work.',
      },
      {
        id: '4',
        question: 'How do I report a bug?',
        answer: 'To report bugs:\n\n1. Go to Help & Support > Contact Support\n2. Select "Report Bug"\n3. Provide details:\n   - What happened\n   - When it happened\n   - Steps to reproduce\n   - Screenshots/videos if possible\n   - Device model and OS version\n4. Submit report\n\nWe review all bug reports and fix them in app updates.',
      },
    ],
  },
};

interface GenericFAQScreenProps {
  routeKey?: string;
}

export default function GenericFAQScreen({ routeKey = 'delivery-faq-customer-not-available' }: GenericFAQScreenProps) {
  const router = useRouter();
  const fallbackData = FAQ_DATA[routeKey] || FAQ_DATA['delivery-faq-customer-not-available'];
  const [faqData, setFaqData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fallback = FAQ_DATA[routeKey] || FAQ_DATA['delivery-faq-customer-not-available'];
    let cancelled = false;
    setLoading(true);
    getFaqByKey(routeKey)
      .then((data) => {
        if (!cancelled && data?.faqs?.length) setFaqData({ title: data.title, faqs: data.faqs });
        else if (!cancelled) setFaqData(fallback);
      })
      .catch(() => {
        if (!cancelled) setFaqData(fallback);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [routeKey]);

  const toggleFAQ = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  return (
    <SafeAreaView style={paymentFAQStyles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <Header
        title={faqData.title}
        subtitle="Frequently asked questions"
        onBack={() => router.back()}
      />

      <ScrollView
        style={paymentFAQStyles.scrollView}
        contentContainerStyle={paymentFAQStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={{ paddingVertical: scale(24), alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#155DFC" />
          </View>
        ) : (
        <View style={paymentFAQStyles.faqsContainer}>
          {(faqData.faqs || []).map((faq) => {
            const isExpanded = expandedIds.has(faq.id);
            return (
              <View key={faq.id} style={paymentFAQStyles.faqCard}>
                <TouchableOpacity
                  style={paymentFAQStyles.faqQuestion}
                  onPress={() => toggleFAQ(faq.id)}
                  activeOpacity={0.7}
                >
                  <Text variant="body" color="#101828" style={paymentFAQStyles.faqQuestionText}>
                    {faq.question}
                  </Text>
                  <View
                    style={[
                      paymentFAQStyles.chevronContainer,
                      isExpanded && paymentFAQStyles.chevronExpanded,
                    ]}
                  >
                    <ChevronDownIcon size={scale(20)} color="#6B7280" />
                  </View>
                </TouchableOpacity>
                {isExpanded && (
                  <View style={paymentFAQStyles.faqAnswer}>
                    <Text variant="body" color="#364153" style={paymentFAQStyles.faqAnswerText}>
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


