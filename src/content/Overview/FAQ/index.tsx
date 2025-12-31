'use client';

import React, { useRef, useState } from 'react';
import {
  alpha,
  Box,
  Container,
  Paper,
  Typography,
  styled,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Divider,
  Collapse,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const COLORS = {
  ink: '#0f172a',
  slate: '#64748b',
  blue: '#2563eb',
};

const Section = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#f4f6fb',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

const Title = styled(Typography)(() => ({
  textAlign: 'center',
  fontWeight: 900,
  fontSize: '2.2rem',
  letterSpacing: -0.3,
  color: COLORS.ink,
}));

const Sub = styled(Typography)(() => ({
  textAlign: 'center',
  color: COLORS.slate,
  maxWidth: 820,
  margin: '8px auto 22px',
  fontSize: 14.5,
}));

const Card = styled(Paper)(() => ({
  margin: '0 auto',
  marginTop: 10,
  maxWidth: 880,
  borderRadius: 18,
  backgroundColor: '#ffffff',
  border: `1px solid ${alpha(COLORS.ink, 0.05)}`,
  boxShadow: '0 18px 40px rgba(15,23,42,0.04)',
  overflow: 'hidden',
}));

const FAQAccordion = styled(Accordion)(() => ({
  backgroundColor: '#fff',
  boxShadow: 'none',
  margin: 0,
  '&:before': { display: 'none' },
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${alpha(COLORS.ink, 0.04)}`,
  },
}));

const Row = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(1.2, 2.4),
  minHeight: 0,
  '& .MuiAccordionSummary-content': {
    margin: 0,
    alignItems: 'center',
    color: COLORS.ink,
    fontWeight: 600,
  },
}));

const IconWrap = styled(Box)(() => ({
  width: 24,
  height: 24,
  borderRadius: 999,
  display: 'grid',
  placeItems: 'center',
  backgroundColor: alpha(COLORS.ink, 0.05),
  transition: 'transform .22s ease, background-color .18s ease',
}));

const Body = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(0.2, 2.4, 1.6),
  color: '#475569',
}));

type FAQ = { q: string; a: string };

const ITEMS: FAQ[] = [
  {
    q: 'Who can be listed in the directory?',
    a: 'Banks, NBFCs, DSAs, and verified sales partners. Each listing shows role, product focus, city, ticket size, and available contact methods (Call/WhatsApp/Email).',
  },
  {
    q: 'How are contacts verified?',
    a: 'Every profile goes live only after KYC/organization validation. We periodically re-verify listings and remove or flag inactive/invalid contacts.',
  },
  {
    q: 'Will commission details be visible?',
    a: 'Where available, we display expected payout/commission notes. Exact numbers may vary by partner—you should confirm final terms directly with them.',
  },
  {
    q: 'How do I add or claim my profile?',
    a: 'Click “List Your Profile” and submit your details, products, cities, and documents. After our team’s verification, your profile goes live.',
  },
  {
    q: 'How does pricing work?',
    a: 'Free plan offers limited views. Pro unlocks unlimited access and advanced filters; Enterprise includes team seats and API access. Billing is in INR; yearly plans get 2 months free.',
  },
  {
    q: 'Do you provide GST invoices?',
    a: 'Yes. Pro/Enterprise subscriptions receive GST-compliant invoices. Please ensure your legal name, GSTIN, and address are correct in Billing.',
  },
  {
    q: 'What is your refund/cancellation policy?',
    a: 'Monthly plans don’t offer prorated refunds; you can cancel for the next cycle. Yearly plans don’t support mid-cycle refunds, but you can turn off renewal.',
  },
  {
    q: 'How frequently is data updated?',
    a: 'New contacts are added weekly and ongoing clean-ups/verification are performed. You can flag outdated contacts via the “Report” button.',
  },
  {
    q: 'Can I get API access?',
    a: 'Enterprise plans can access curated, rate-limited endpoints—for CRM sync, lead routing, or compliance audits. Requires approval and terms.',
  },
  {
    q: 'What about privacy and misuse prevention?',
    a: 'Contacts are for genuine business use only. Bulk scraping and spam are prohibited. Rate limits and activity monitoring help prevent abuse.',
  },
];

const FAQSection: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <Section id="faq">
      <Container>
        <Title>Frequently Asked Questions</Title>
        <Sub>
          A verified lender, banker &amp; sales directory — clear policies, transparent pricing,
          and fast support when you need it.
        </Sub>

        <Card>
          {ITEMS.map((it, i) => {
            const expanded = open === i;

            return (
              <FAQAccordion
                key={i}
                expanded={expanded}
                onChange={(_, isOpen) => {
                  const idx = isOpen ? i : null;
                  setOpen(idx);
                  if (isOpen && rowRefs.current[i]) {
                    rowRefs.current[i]!.scrollIntoView({
                      behavior: 'smooth',
                      block: 'nearest',
                    });
                  }
                }}
              >
                <Row
                  ref={(el) => (rowRefs.current[i] = el)}
                  expandIcon={
                    <IconButton disableRipple sx={{ p: 0.25 }}>
                      <IconWrap
                        sx={{
                          transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
                          backgroundColor: expanded
                            ? alpha(COLORS.blue, 0.12)
                            : alpha(COLORS.ink, 0.05),
                        }}
                      >
                        <AddRoundedIcon
                          sx={{
                            color: expanded ? COLORS.blue : COLORS.ink,
                            fontSize: 16,
                          }}
                        />
                      </IconWrap>
                    </IconButton>
                  }
                  sx={{
                    backgroundColor: expanded ? alpha(COLORS.blue, 0.03) : '#fff',
                  }}
                >
                  <Typography sx={{ fontSize: 15.2 }}>{it.q}</Typography>
                </Row>

                <Collapse in={expanded} timeout={200} unmountOnExit>
                  <Divider
                    sx={{
                      mx: 2,
                      my: 0.8,
                      borderColor: alpha(COLORS.ink, 0.06),
                    }}
                  />
                  <Body>
                    <Typography
                      sx={{
                        fontSize: 14.2,
                        lineHeight: 1.6,
                        color: '#475569',
                      }}
                    >
                      {it.a}
                    </Typography>
                  </Body>
                </Collapse>
              </FAQAccordion>
            );
          })}
        </Card>
      </Container>
    </Section>
  );
};

export default FAQSection;


