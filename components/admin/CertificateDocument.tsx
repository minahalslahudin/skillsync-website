import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const s = StyleSheet.create({
  page: {
    backgroundColor: '#09090b',
    padding: 60,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  border: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    border: '1pt solid #27272a',
  },
  badge: {
    fontSize: 9,
    color: '#6ee7b7',
    letterSpacing: 3,
    marginBottom: 28,
  },
  intro: {
    fontSize: 11,
    color: '#a1a1aa',
    marginBottom: 12,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fafafa',
    marginBottom: 14,
  },
  body: {
    fontSize: 11,
    color: '#a1a1aa',
    textAlign: 'center',
    marginBottom: 8,
  },
  workshop: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fafafa',
    textAlign: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 10,
    color: '#71717a',
    marginBottom: 44,
  },
  divider: {
    width: 56,
    height: 1,
    backgroundColor: '#3f3f46',
    marginBottom: 44,
  },
  sigName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fafafa',
  },
  sigTitle: {
    fontSize: 9,
    color: '#71717a',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    fontSize: 8,
    color: '#52525b',
    textAlign: 'center',
  },
})

interface Props {
  recipientName: string
  workshopName:  string
  date:          string
  founderName?:  string
}

export default function CertificateDocument({
  recipientName,
  workshopName,
  date,
  founderName = 'Minal Buttar',
}: Props) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.border} />
        <Text style={s.badge}>CERTIFICATE OF COMPLETION</Text>
        <Text style={s.intro}>This is to certify that</Text>
        <Text style={s.name}>{recipientName}</Text>
        <Text style={s.body}>has successfully completed the workshop</Text>
        <Text style={s.workshop}>{workshopName}</Text>
        <Text style={s.date}>{date}</Text>
        <View style={s.divider} />
        <View style={{ alignItems: 'center' }}>
          <Text style={s.sigName}>{founderName}</Text>
          <Text style={s.sigTitle}>Founder, skillSYNC</Text>
        </View>
        <Text style={s.footer}>skillSYNC × skillIT</Text>
      </Page>
    </Document>
  )
}
