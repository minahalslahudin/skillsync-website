import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const s = StyleSheet.create({
  page: {
    backgroundColor: '#09090b',
    color: '#d4d4d8',
    padding: '60pt 72pt',
    fontSize: 11,
    lineHeight: 1.8,
  },
  header: {
    marginBottom: 36,
    borderBottom: '1pt solid #27272a',
    paddingBottom: 16,
  },
  brand: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fafafa',
  },
  brandSub: {
    fontSize: 9,
    color: '#71717a',
    marginTop: 2,
    letterSpacing: 1,
  },
  date: {
    fontSize: 10,
    color: '#71717a',
    marginBottom: 24,
  },
  subject: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fafafa',
    marginBottom: 20,
  },
  body: {
    fontSize: 11,
    color: '#d4d4d8',
    marginBottom: 12,
  },
  highlight: {
    color: '#fafafa',
    fontWeight: 'bold',
  },
  closing: {
    marginTop: 36,
  },
  sigBlock: {
    marginTop: 48,
  },
  sigName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fafafa',
  },
  sigTitle: {
    fontSize: 9,
    color: '#71717a',
    marginTop: 3,
  },
})

interface Props {
  volunteerName:    string
  role:             string
  type:             'experience' | 'recommendation'
  achievementsDesc: string
  date:             string
  founderName?:     string
}

export default function VolunteerLetterDocument({
  volunteerName,
  role,
  type,
  achievementsDesc,
  date,
  founderName = 'Minal Buttar',
}: Props) {
  const isRecommendation = type === 'recommendation'

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.brand}>skillSYNC × skillIT</Text>
          <Text style={s.brandSub}>OFFICIAL LETTER</Text>
        </View>

        <Text style={s.date}>{date}</Text>

        <Text style={s.subject}>
          {isRecommendation ? 'Letter of Recommendation' : 'Experience Letter'} — {volunteerName}
        </Text>

        <Text style={s.body}>To Whom It May Concern,</Text>

        {isRecommendation ? (
          <>
            <Text style={s.body}>
              It is with great pleasure that I recommend{' '}
              <Text style={s.highlight}>{volunteerName}</Text>, who has served as{' '}
              <Text style={s.highlight}>{role}</Text> at skillSYNC.
            </Text>
            <Text style={s.body}>{achievementsDesc}</Text>
            <Text style={s.body}>
              I wholeheartedly recommend {volunteerName} for any position that demands
              dedication, creativity, and a collaborative spirit. They have been an exceptional
              asset to our team and I am confident they will bring the same energy wherever they go.
            </Text>
          </>
        ) : (
          <>
            <Text style={s.body}>
              This is to certify that{' '}
              <Text style={s.highlight}>{volunteerName}</Text> has served as{' '}
              <Text style={s.highlight}>{role}</Text> at skillSYNC.
            </Text>
            <Text style={s.body}>{achievementsDesc}</Text>
            <Text style={s.body}>
              During their time with us, {volunteerName} demonstrated strong commitment,
              professionalism, and a genuine passion for learning and growth.
              We wish them the very best in their future endeavours.
            </Text>
          </>
        )}

        <View style={s.closing}>
          <Text style={s.body}>Warm regards,</Text>
        </View>
        <View style={s.sigBlock}>
          <Text style={s.sigName}>{founderName}</Text>
          <Text style={s.sigTitle}>Founder, skillSYNC</Text>
        </View>
      </Page>
    </Document>
  )
}
