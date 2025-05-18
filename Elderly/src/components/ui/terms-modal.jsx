"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../ui/dialog";

export function TermsModal({ isOpen, onAccept }) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Terms and Conditions for Elderly Care Dashboard
          </DialogTitle>
          <DialogDescription className="text-lg pt-4">
            Please read these terms carefully before using the Care Dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 text-lg">
          {/* Repeatable Sections */}
          {[
            {
              title: "1. Service Description",
              text: `The Elderly Care Dashboard provides tools to monitor health, record mood, receive medication reminders, and communicate with caregivers. This service is designed to support elderly individuals in maintaining their health and wellbeing.`,
            },
            {
              title: "2. Privacy and Data Collection",
              text: `We collect health data, mood recordings, and usage information to provide personalized care recommendations. Your data is protected and will only be shared with authorized caregivers and healthcare providers.`,
            },
            {
              title: "3. Voice Recording Consent",
              text: `By accepting these terms, you consent to the recording and analysis of your voice for mood assessment and AI assistant functionality. Voice recordings are stored securely and used only for the purposes described.`,
            },
            {
              title: "4. Medication Reminders",
              text: `Medication reminders are provided as a convenience and should not replace professional medical advice. Always follow your healthcare provider's instructions regarding medication.`,
            },
            {
              title: "5. Emergency Services",
              text: `The Care Dashboard is not an emergency service. In case of a medical emergency, please contact emergency services immediately by dialing your local emergency number.`,
            },
          ].map((section, i) => (
            <section key={i}>
              <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
              <p>{section.text}</p>
            </section>
          ))}
        </div>

        <DialogFooter>
          <Button
            onClick={onAccept}
            className="w-full sm:w-auto text-xl py-6 px-8 bg-green-600 hover:bg-green-700"
          >
            I Accept the Terms
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
