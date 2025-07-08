<template>
    <div class="p-4">
        <Card class="shadow-2xl border-none max-w-5xl mx-auto">
            <template #title>
                <div class="text-2xl font-bold">Privacy Policy</div>
            </template>
            <template #content>
                <ScrollPanel style="max-height: 85vh" class="custom-scroll">
                    <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">Effective Date: July 8, 2025</p>

                    <p class="mb-4">
                        SubscribeMe ("we", "our", or "us") operates the SubMe mobile application (the "App").
                        We are committed to protecting your privacy. This Privacy Policy describes how we
                        collect, use, and safeguard your information when you use SubMe.
                    </p>

                    <p class="mb-4 font-semibold">
                        By using the App, you agree to the practices outlined in this Privacy Policy.
                    </p>

                    <Divider />

                    <h3 class="text-xl font-semibold mb-2">1. Information We Collect</h3>

                    <h4 class="font-semibold mb-1">1.1 Personal Information:</h4>
                    <ul class="list-disc pl-6 mb-4">
                        <li>Name</li>
                        <li>Phone number</li>
                    </ul>

                    <h4 class="font-semibold mb-1">1.2 Device and Usage Information:</h4>
                    <ul class="list-disc pl-6 mb-4">
                        <li>Device type and operating system</li>
                        <li>App usage logs</li>
                        <li>Crash data</li>
                        <li>IP address</li>
                        <li>Firebase-generated analytics</li>
                    </ul>

                    <Divider />

                    <h3 class="text-xl font-semibold mb-2">2. How We Use Your Information</h3>
                    <ul class="list-disc pl-6 mb-4">
                        <li>Create and manage your user account</li>
                        <li>Track and manage your subscriptions</li>
                        <li>Improve app performance and stability</li>
                        <li>Send relevant notifications (with your permission)</li>
                        <li>Analyze usage data to improve user experience</li>
                        <li>Monitor and fix crashes or bugs</li>
                    </ul>

                    <Divider />

                    <h3 class="text-xl font-semibold mb-2">3. Third-Party Services</h3>
                    <p class="mb-4">We use trusted third-party services to operate certain features:</p>
                    <ul class="list-disc pl-6 mb-4">
                        <li>Firebase Cloud Messaging</li>
                        <li>Firebase Crashlytics</li>
                        <li>Firebase Analytics</li>
                    </ul>

                    <Divider />

                    <h3 class="text-xl font-semibold mb-2">4. Data Sharing and Disclosure</h3>
                    <p class="mb-4">
                        We do not sell your personal information. We only share data as necessary with:
                    </p>
                    <ul class="list-disc pl-6 mb-4">
                        <li>Trusted service providers (e.g., Firebase)</li>
                        <li>Legal authorities if required to comply with the law</li>
                        <li>In case of a business transfer (e.g., merger or acquisition)</li>
                    </ul>

                    <Divider />

                    <h3 class="text-xl font-semibold mb-2">5. Data Retention</h3>
                    <p class="mb-4">
                        We retain your information for as long as your account is active or as needed to
                        provide the service. You may request deletion by contacting us at
                        <a href="mailto:subscribe.me.uz@gmail.com" class="text-blue-500 underline"
                            >subscribe.me.uz@gmail.com</a
                        >.
                    </p>

                    <Divider />

                    <h3 class="text-xl font-semibold mb-2">6. Your Privacy Rights</h3>
                    <ul class="list-disc pl-6 mb-4">
                        <li>Access or update your personal data</li>
                        <li>Disable push notifications via device settings</li>
                        <li>Request deletion of your data</li>
                    </ul>

                    <Divider />

                    <h3 class="text-xl font-semibold mb-2">7. Security</h3>
                    <p class="mb-4">
                        We implement industry-standard security measures to protect your data. However, no
                        system is completely secure.
                    </p>

                    <Divider />

                    <h3 class="text-xl font-semibold mb-2">8. Children’s Privacy</h3>
                    <p class="mb-4">
                        SubMe is not directed to children under 13. We do not knowingly collect data from
                        them.
                    </p>

                    <Divider />

                    <h3 class="text-xl font-semibold mb-2">9. Changes to This Privacy Policy</h3>
                    <p class="mb-4">
                        We may update this policy from time to time. Any changes will be posted within the App
                        and reflected by the updated "Effective Date".
                    </p>

                    <Divider />

                    <h3 class="text-xl font-semibold mb-2">10. Contact Us</h3>
                    <p class="mb-2">If you have any questions about this Privacy Policy, contact us at:</p>
                    <p>
                        Email:
                        <a href="mailto:subscribe.me.uz@gmail.com" class="text-blue-500 underline"
                            >subscribe.me.uz@gmail.com</a
                        >
                    </p>
                    <p>Company: SubscribeMe</p>
                </ScrollPanel>
            </template>
        </Card>
    </div>
</template>

<script setup>
import Card from 'primevue/card';
import ScrollPanel from 'primevue/scrollpanel';
import Divider from 'primevue/divider';
import { useLayout } from '@/layout/composables/layout';

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();
</script>

<style scoped>
.custom-scroll ::-webkit-scrollbar {
    width: 6px;
}
.custom-scroll ::-webkit-scrollbar-thumb {
    background-color: var(--primary-color);
    border-radius: 6px;
}
</style>
