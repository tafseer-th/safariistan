import { useState } from "react";
import { Linking, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarDays, CheckCircle2, MessageCircle, Minus, Plus, Send } from "lucide-react-native";
import { SelectField } from "@/components/ListScreen";
import { Button, T } from "@/components/ui";
import { colors, fonts, shadow } from "@/lib/theme";
import { submitBooking, whatsappUrl } from "@/lib/api";

// Local date as YYYY-MM-DD (what the backend expects).
function toIso(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function fromIso(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function nightsBetween(a, b) {
  if (!a || !b) return null;
  const n = Math.round((fromIso(b) - fromIso(a)) / 86400000);
  return n > 0 ? n : null;
}

function Label({ children }) {
  return (
    <T weight="semibold" style={styles.label}>
      {children}
    </T>
  );
}

export function Input({ label, multiline, style, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={style}>
      {label ? <Label>{label}</Label> : null}
      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor={colors.gray400}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, multiline && { minHeight: 88, textAlignVertical: "top" }, focused && styles.inputFocused]}
      />
    </View>
  );
}

// Tap to open the phone's calendar. Past dates are disabled.
export function DateField({ label, value, onChange, minimumDate, style }) {
  const [open, setOpen] = useState(false);
  const min = minimumDate ? fromIso(minimumDate) : startOfToday();
  return (
    <View style={style}>
      <Label>{label}</Label>
      <Pressable onPress={() => setOpen(true)} style={[styles.input, styles.dateBox]}>
        <T style={{ color: value ? colors.gray800 : colors.gray400, fontSize: 14 }}>
          {value ? fromIso(value).toDateString().slice(4) : "Select date"}
        </T>
        <CalendarDays size={16} color={colors.gray500} />
      </Pressable>
      {open && (
        <DateTimePicker
          value={value ? fromIso(value) : min}
          mode="date"
          minimumDate={min}
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(event, date) => {
            setOpen(Platform.OS === "ios" && event.type !== "set" ? true : false);
            if (event.type === "set" && date) onChange(toIso(date));
          }}
        />
      )}
    </View>
  );
}

// "−  2  +" number picker for persons / days.
export function Stepper({ label, value, onChange, min = 1, max = 100, style }) {
  const n = Number(value) || min;
  const set = (v) => onChange(String(Math.min(max, Math.max(min, v))));
  return (
    <View style={style}>
      <Label>{label}</Label>
      <View style={[styles.input, styles.stepper]}>
        <Pressable onPress={() => set(n - 1)} hitSlop={8} disabled={n <= min} style={{ opacity: n <= min ? 0.3 : 1 }}>
          <Minus size={18} color={colors.green700} />
        </Pressable>
        <T weight="semibold" style={{ fontSize: 15 }}>
          {n}
        </T>
        <Pressable onPress={() => set(n + 1)} hitSlop={8} disabled={n >= max} style={{ opacity: n >= max ? 0.3 : 1 }}>
          <Plus size={18} color={colors.green700} />
        </Pressable>
      </View>
    </View>
  );
}

export function Row({ children }) {
  return <View style={{ flexDirection: "row", gap: 12 }}>{children}</View>;
}

export function BookingSuccess({ id, name, itemName, onReset, whatsappText }) {
  const text =
    whatsappText ||
    `Hi, I just sent a booking request on your app for ${itemName} (reference #${id}). My name is ${name}.`;
  return (
    <View style={styles.success}>
      <CheckCircle2 size={48} color={colors.green600} />
      <T weight="extrabold" style={{ fontSize: 20, marginTop: 12, textAlign: "center" }}>
        Thank you, {name}!
      </T>
      <T style={{ marginTop: 8, color: colors.gray600, textAlign: "center", lineHeight: 21 }}>
        Your request <T weight="bold">#{id}</T>
        {itemName ? (
          <>
            {" "}for <T weight="bold">{itemName}</T>
          </>
        ) : null}{" "}
        has been received. Our team will contact you shortly.
      </T>
      <Button
        title="Chat on WhatsApp"
        icon={MessageCircle}
        onPress={() => Linking.openURL(whatsappUrl(text))}
        style={{ alignSelf: "stretch", marginTop: 20 }}
      />
      <Button title="Send another request" variant="outline" onPress={onReset} style={{ alignSelf: "stretch", marginTop: 8 }} />
    </View>
  );
}

/**
 * Booking / inquiry card. Children render the fields from `form` / `set`;
 * `buildPayload(form)` turns them into the /api/bookings/ body.
 */
export function InquiryForm({ title, subtitle, initial, buildPayload, itemName, submitLabel = "Send booking request", children, card = true }) {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const data = await submitBooking(buildPayload(form));
      setDone({ id: data.id, name: form.name.trim() });
      setForm(initial);
    } catch (e) {
      setError(e.message === "Network request failed" ? "No internet connection. Please try again." : e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return <BookingSuccess {...done} itemName={itemName} onReset={() => setDone(null)} />;

  return (
    <View style={card ? styles.card : null}>
      {title ? (
        <T weight="bold" style={{ fontSize: 18 }}>
          {title}
        </T>
      ) : null}
      {subtitle ? <T style={{ marginTop: 4, color: colors.gray500, fontSize: 13 }}>{subtitle}</T> : null}
      <View style={{ gap: 12, marginTop: title ? 18 : 0 }}>{children(form, set)}</View>
      {error ? <T style={styles.error}>{error}</T> : null}
      <Button title={submitting ? "Sending…" : submitLabel} icon={Send} loading={submitting} onPress={submit} style={{ marginTop: 18 }} />
    </View>
  );
}

export const CITY_OPTIONS = [
  { label: "Select city", value: "" },
  { label: "Lahore", value: "Lahore" },
  { label: "Islamabad", value: "Islamabad" },
  { label: "Karachi", value: "Karachi" },
  { label: "Other", value: "Other" },
];

export { SelectField };

const styles = StyleSheet.create({
  label: { fontSize: 12, color: colors.gray500, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.gray800,
    fontFamily: fonts.regular,
    backgroundColor: colors.white,
  },
  inputFocused: { borderColor: colors.green600 },
  dateBox: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  stepper: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 11 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: 20,
    ...shadow.lg,
  },
  error: {
    marginTop: 14,
    backgroundColor: colors.red50,
    color: colors.red600,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13,
    overflow: "hidden",
  },
  success: {
    backgroundColor: colors.green50,
    borderWidth: 1,
    borderColor: colors.green200,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    ...shadow.lg,
  },
});
