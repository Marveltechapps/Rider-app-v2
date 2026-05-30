/**
 * Payment FAQ Screen Component
 * Displays FAQ questions and answers for payment topics
 */

import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFaqByKey } from '../api/content';
import Text from '../components/common/Text';
import Header from '../components/layout/Header';
import ChevronDownIcon from '../components/icons/ChevronRightIcon';
import paymentFAQStyles from '../styles/paymentFAQStyles';
import { scale, verticalScale } from '../utils/responsive';

interface PaymentFAQScreenProps {
  routeKey?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: { [key: string]: { title: string; faqs: FAQ[] } } = {
  'payment-faq-not-received': {
    title: 'Payment Not Received',
    faqs: [
      {
        id: '1',
        question: 'Why haven\'t I received my payment?',
        answer: 'Payments are typically processed within 1-2 business days after completing a delivery. If it\'s been longer, please check:\n\n1. Your bank account details are correct\n2. Your account is verified\n3. There are no pending verification issues\n\nIf everything is correct, contact support with your rider ID and delivery date.',
      },
      {
        id: '2',
        question: 'How do I check my payment status?',
        answer: 'You can check your payment status in the Earnings section of the app:\n\n1. Go to Profile > Earnings\n2. View your payment history\n3. Check the status of each payment (Pending, Processing, Completed)\n\nPending payments will show when they\'ll be processed.',
      },
      {
        id: '3',
        question: 'What should I do if payment is missing?',
        answer: 'If a payment is missing:\n\n1. Verify the delivery was completed successfully\n2. Check if the payment is still pending (may take 1-2 days)\n3. Ensure your bank/UPI details are correct\n4. Contact support with:\n   - Delivery ID\n   - Date and time\n   - Screenshot of the order\n\nWe\'ll investigate and resolve within 24-48 hours.',
      },
      {
        id: '4',
        question: 'Can I get payment faster?',
        answer: 'Yes! You can cash out up to 2 times per day using the instant cash out feature:\n\n1. Go to Earnings > Cash Out\n2. Select the amount\n3. Choose instant transfer (small fee applies)\n\nRegular transfers are free but take 1-2 business days.',
      },
    ],
  },
  'payment-faq-wrong-amount': {
    title: 'Wrong Payment Amount',
    faqs: [
      {
        id: '1',
        question: 'Why is my payment amount different from expected?',
        answer: 'Payment amounts are calculated based on:\n\n1. Base delivery fee\n2. Distance traveled\n3. Time taken\n4. Peak hour bonuses\n5. Customer tips\n6. Any deductions (cancellations, complaints)\n\nCheck the Earnings breakdown for detailed calculation.',
      },
      {
        id: '2',
        question: 'How are delivery payments calculated?',
        answer: 'Delivery payments include:\n\n• Base Fee: ₹X per delivery\n• Distance Fee: ₹Y per km\n• Time Bonus: Additional for quick deliveries\n• Peak Hours: Extra during rush hours\n• Tips: 100% of customer tips\n\nDeductions may apply for:\n• Late deliveries\n• Customer complaints\n• Order cancellations',
      },
      {
        id: '3',
        question: 'I was charged for a cancellation I didn\'t cause',
        answer: 'If you believe a cancellation charge is incorrect:\n\n1. Check the cancellation reason in Order Details\n2. If it shows "Rider Cancelled" but you didn\'t:\n   - Contact support immediately\n   - Provide order ID and timestamp\n   - We\'ll review and refund if it\'s our error\n\nValid cancellations (customer not available, wrong address) won\'t be charged.',
      },
      {
        id: '4',
        question: 'How do I dispute a payment amount?',
        answer: 'To dispute a payment:\n\n1. Go to Earnings > Payment History\n2. Select the disputed payment\n3. Click "Report Issue"\n4. Provide details:\n   - Expected amount\n   - Actual amount received\n   - Order ID\n   - Screenshots if available\n\nOur team will review within 48 hours and adjust if needed.',
      },
    ],
  },
  'payment-faq-delays': {
    title: 'Payment Delays',
    faqs: [
      {
        id: '1',
        question: 'How long do payments take to process?',
        answer: 'Payment processing times:\n\n• Regular Transfer: 1-2 business days\n• Instant Cash Out: Within minutes (fee applies)\n• Bank Transfer: 1-2 business days\n• UPI Transfer: Usually same day\n\nNote: Weekends and holidays may add 1-2 extra days.',
      },
      {
        id: '2',
        question: 'Why is my payment delayed?',
        answer: 'Common reasons for payment delays:\n\n1. Bank holidays or weekends\n2. Account verification pending\n3. Incorrect bank/UPI details\n4. Bank processing delays\n5. High transaction volume\n\nCheck your payment method details in Profile > Bank Details.',
      },
      {
        id: '3',
        question: 'What can I do to get payments faster?',
        answer: 'To receive payments faster:\n\n1. Use Instant Cash Out (available 2x daily)\n2. Ensure your account is fully verified\n3. Use UPI instead of bank transfer\n4. Keep your payment details updated\n5. Complete KYC verification\n\nInstant cash out processes within minutes for a small fee.',
      },
      {
        id: '4',
        question: 'My payment is stuck in processing',
        answer: 'If payment is stuck:\n\n1. Wait 48 hours (normal processing time)\n2. Check for any verification issues\n3. Verify bank/UPI details are correct\n4. Contact support if:\n   - More than 3 business days\n   - Payment shows "Failed"\n   - No update after 48 hours\n\nProvide your rider ID and payment reference number.',
      },
    ],
  },
};

export default function PaymentFAQScreen({ routeKey = 'payment-faq-not-received' }: PaymentFAQScreenProps) {
  const router = useRouter();
  const fallbackData = FAQ_DATA[routeKey] || FAQ_DATA['payment-faq-not-received'];
  const [faqData, setFaqData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getFaqByKey(routeKey)
      .then((data) => {
        if (!cancelled && data?.faqs?.length) setFaqData({ title: data.title, faqs: data.faqs });
        else if (!cancelled) setFaqData(fallbackData);
      })
      .catch(() => {
        if (!cancelled) setFaqData(fallbackData);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [routeKey, fallbackData]);

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
          {faqData.faqs.map((faq) => {
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

