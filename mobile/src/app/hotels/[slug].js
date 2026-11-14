import { Linking, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Hotel as HotelIcon, MapPin, Users } from "lucide-react-native";
import { DetailScreen, FormSection, Gallery, Paragraph, Section, TitleBlock, photosOf } from "@/components/Detail";
import { DateField, Input, InquiryForm, Row, Stepper, nightsBetween } from "@/components/Forms";
import { Badge, T } from "@/components/ui";
import { colors } from "@/lib/theme";
import { formatPrice, whatsappUrl } from "@/lib/api";

function Room({ room }) {
  return (
    <View style={styles.room}>
      {room.image ? <Image source={{ uri: room.image }} style={styles.roomImage} contentFit="cover" /> : null}
      <T weight="bold" style={{ fontSize: 15 }}>
        {room.name}
      </T>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 }}>
        <Users size={14} color={colors.gray500} />
        <T style={{ color: colors.gray500, fontSize: 13 }}>Up to {room.capacity} guests</T>
      </View>
      {room.description ? <T style={{ marginTop: 8, color: colors.gray600, fontSize: 13, lineHeight: 19 }}>{room.description}</T> : null}
      <View style={styles.roomFooter}>
        <T weight="extrabold" style={{ fontSize: 18, color: colors.green700 }}>
          {formatPrice(room.price_per_night)}
          <T weight="medium" style={{ fontSize: 12, color: colors.gray500 }}>
            /night
          </T>
        </T>
        {!room.is_available && <Badge style={{ backgroundColor: colors.gray100 }}>Not available</Badge>}
      </View>
    </View>
  );
}

export default function HotelDetail() {
  return (
    <DetailScreen endpoint="hotels" what="hotel">
      {(hotel) => (
        <>
          <Gallery photos={photosOf(hotel)} Fallback={HotelIcon} />
          <TitleBlock
            badge={`${hotel.category_display} · ${hotel.hotel_type_display}`}
            title={hotel.name}
            meta={[
              hotel.location && { Icon: MapPin, text: hotel.address || hotel.location.name },
            ]}
            priceLabel="Per night from"
            price={hotel.discounted_price}
            original={hotel.price_from}
            discount={hotel.discount_percent}
          />

          {hotel.description ? (
            <Section title="About this stay">
              <Paragraph>{hotel.description}</Paragraph>
            </Section>
          ) : null}

          <Section title="Rooms">
            {hotel.rooms.length === 0 ? (
              <View style={styles.noRooms}>
                <T style={{ color: colors.gray500, lineHeight: 21 }}>
                  Room details coming soon.{" "}
                  <T
                    weight="semibold"
                    style={{ color: colors.green700 }}
                    onPress={() => Linking.openURL(whatsappUrl(`Hi, I want room rates for ${hotel.name}.`))}
                  >
                    Ask for rates on WhatsApp
                  </T>
                </T>
              </View>
            ) : (
              <View style={{ gap: 14 }}>
                {hotel.rooms.map((r) => (
                  <Room key={r.id} room={r} />
                ))}
              </View>
            )}
          </Section>

          <FormSection>
            <InquiryForm
              title="Book / Inquiry"
              subtitle="Send your details and we will share a quote."
              itemName={hotel.name}
              initial={{ name: "", phone: "", checkIn: "", checkOut: "", guests: "2", message: "" }}
              buildPayload={(f) => ({
                booking_type: "hotel",
                item_name: hotel.name,
                name: f.name.trim(),
                phone: f.phone.trim(),
                destination: hotel.location?.name || "",
                travel_date: f.checkIn || null,
                end_date: f.checkOut || null,
                days: nightsBetween(f.checkIn, f.checkOut),
                guests: Number(f.guests) || 1,
                message: f.message,
              })}
            >
              {(f, set) => (
                <>
                  <Input placeholder="Your name" value={f.name} onChangeText={set("name")} autoComplete="name" />
                  <Input placeholder="Phone / WhatsApp" value={f.phone} onChangeText={set("phone")} keyboardType="phone-pad" autoComplete="tel" />
                  <Row>
                    <DateField
                      label="Check-in"
                      value={f.checkIn}
                      onChange={(v) => {
                        set("checkIn")(v);
                        if (f.checkOut && f.checkOut <= v) set("checkOut")("");
                      }}
                      style={{ flex: 1 }}
                    />
                    <DateField label="Check-out" value={f.checkOut} onChange={set("checkOut")} minimumDate={f.checkIn || undefined} style={{ flex: 1 }} />
                  </Row>
                  <Stepper label="Guests" value={f.guests} onChange={set("guests")} />
                  <Input placeholder="Message (optional)" value={f.message} onChangeText={set("message")} multiline />
                </>
              )}
            </InquiryForm>
          </FormSection>
        </>
      )}
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  noRooms: { backgroundColor: colors.gray50, borderRadius: 16, padding: 20 },
  room: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 16, padding: 14 },
  roomImage: { height: 150, borderRadius: 12, marginBottom: 12 },
  roomFooter: { marginTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
