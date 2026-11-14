import { StyleSheet, View } from "react-native";
import { Clock, Compass, MapPin, Users } from "lucide-react-native";
import { CheckList, DetailScreen, FormSection, Gallery, Paragraph, Section, TitleBlock, photosOf } from "@/components/Detail";
import { DateField, Input, InquiryForm, Row, Stepper } from "@/components/Forms";
import { T } from "@/components/ui";
import { colors } from "@/lib/theme";

export default function TourDetail() {
  return (
    <DetailScreen endpoint="tours" what="tour">
      {(tour) => (
        <>
          <Gallery photos={photosOf(tour)} Fallback={Compass} />
          <TitleBlock
            badge={tour.category_display}
            title={tour.title}
            meta={[
              { Icon: MapPin, text: tour.destination.name },
              { Icon: Clock, text: tour.duration_label },
              { Icon: Users, text: `From ${tour.departure_city_display}` },
            ]}
            priceLabel="Per person"
            price={tour.discounted_price}
            original={tour.price_per_person}
            discount={tour.discount_percent}
          />

          {tour.description || tour.summary ? (
            <Section title="Overview">
              <Paragraph>{tour.description || tour.summary}</Paragraph>
            </Section>
          ) : null}

          {tour.itinerary.length > 0 && (
            <Section title="Itinerary">
              <View style={styles.timeline}>
                {tour.itinerary.map((d) => (
                  <View key={d.id} style={styles.day}>
                    <View style={styles.dot}>
                      <T weight="bold" style={{ color: colors.white, fontSize: 12 }}>
                        {d.day_number}
                      </T>
                    </View>
                    <T weight="semibold" style={{ fontSize: 15 }}>
                      Day {d.day_number}: {d.title}
                    </T>
                    {d.description ? <T style={styles.dayText}>{d.description}</T> : null}
                  </View>
                ))}
              </View>
            </Section>
          )}

          {tour.inclusions.length > 0 && (
            <Section title="Included">
              <CheckList items={tour.inclusions} />
            </Section>
          )}
          {tour.exclusions.length > 0 && (
            <Section title="Not included">
              <CheckList items={tour.exclusions} negative />
            </Section>
          )}

          <FormSection>
            <InquiryForm
              title="Book this tour"
              subtitle="Send your details and we will share a quote."
              itemName={tour.title}
              initial={{ name: "", phone: "", travelDate: "", persons: "2", message: "" }}
              buildPayload={(f) => ({
                booking_type: "tour",
                item_name: tour.title,
                name: f.name.trim(),
                phone: f.phone.trim(),
                destination: tour.destination.name || "",
                travel_date: f.travelDate || null,
                guests: Number(f.persons) || 1,
                message: f.message,
              })}
            >
              {(f, set) => (
                <>
                  <Input placeholder="Your name" value={f.name} onChangeText={set("name")} autoComplete="name" />
                  <Input placeholder="Phone / WhatsApp" value={f.phone} onChangeText={set("phone")} keyboardType="phone-pad" autoComplete="tel" />
                  <Row>
                    <DateField label="Travel date" value={f.travelDate} onChange={set("travelDate")} style={{ flex: 1 }} />
                    <Stepper label="Persons" value={f.persons} onChange={set("persons")} style={{ flex: 1 }} />
                  </Row>
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
  timeline: { borderLeftWidth: 2, borderLeftColor: colors.green100, marginLeft: 13, paddingLeft: 24, gap: 18 },
  day: { position: "relative" },
  dot: {
    position: "absolute",
    left: -39,
    top: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.green600,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: { marginTop: 4, color: colors.gray600, fontSize: 13, lineHeight: 20 },
});
