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
  Collapse
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const Section = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#f9fafb',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(5)
}));

const Title = styled(Typography)({
  textAlign: 'center',
  fontWeight: 900,
  fontSize: '2.2rem', // slightly tighter
  letterSpacing: -0.3,
  color: '#0f172a'
});

const Sub = styled(Typography)({
  textAlign: 'center',
  color: '#64748b',
  maxWidth: 820,
  margin: '8px auto 20px' // was 10px auto 28px
});

const Card = styled(Paper)(({}) => ({
  margin: '0 auto',
  marginTop:'10px',
  maxWidth: 760,
  borderRadius: 12, // 14 -> 12
  backgroundColor: '#fff', 
  border: `1px solid ${alpha('#0f172a', 0.08)}`,
  boxShadow: '0 10px 22px rgba(2,6,23,.05)' // slightly lighter
}));

const FAQAccordion = styled(Accordion)(({}) => ({
  backgroundColor: '#fff',
  boxShadow: 'none',
  margin: 0, // remove outer gaps between accordions
  '&:before': { display: 'none' }
}));

const Row = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(0, 2), // was (0,3)
  minHeight: 56, // was 68
  transition: 'background-color .2s ease',
  borderRadius: 10, // was 12
  margin: theme.spacing(0.25, 1), // was 0.5,1.25
  '& .MuiAccordionSummary-content': {
    margin: 0,
    alignItems: 'center',
    color: '#0f172a',
    fontWeight: 600
  },
  '&:hover': {
    backgroundColor: alpha('#0f172a', 0.02) // subtler
  }
}));

const IconWrap = styled(Box)(({}) => ({
  width: 24, // was 28
  height: 24,
  borderRadius: 8,
  display: 'grid',
  placeItems: 'center',
  backgroundColor: alpha('#0f172a', 0.06),
  transition: 'transform .25s ease, background-color .2s ease'
}));

const Body = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(0.75, 2, 1.5), // was (0,3,3)
  color: '#475569'
}));

type FAQ = { q: string; a: string };

const ITEMS: FAQ[] = [
  {
    q: 'Who can be listed in the directory?',
    a: 'Banks, NBFCs, DSAs, and verified sales partners. Each listing shows role, product focus, city, ticket size, and available contact methods (Call/WhatsApp/Email).'
  },
  {
    q: 'How are contacts verified?',
    a: 'Every profile goes live only after KYC/organization validation. We periodically re-verify listings and remove or flag inactive/invalid contacts.'
  },
  {
    q: 'Will commission details be visible?',
    a: 'Where available, we display expected payout/commission notes. Exact numbers may vary by partner—you should confirm final terms directly with them.'
  },
  {
    q: 'How do I add or claim my profile?',
    a: 'Click “List Your Profile” and submit your details, products, cities, and documents. After our team’s verification, your profile goes live.'
  },
  {
    q: 'How does pricing work?',
    a: 'Free plan offers limited views. Pro unlocks unlimited access and advanced filters; Enterprise includes team seats and API access. Billing is in INR; yearly plans get 2 months free.'
  },
  {
    q: 'Do you provide GST invoices?',
    a: 'Yes. Pro/Enterprise subscriptions receive GST-compliant invoices. Please ensure your legal name, GSTIN, and address are correct in Billing.'
  },
  {
    q: 'What is your refund/cancellation policy?',
    a: 'Monthly plans don’t offer prorated refunds; you can cancel for the next cycle. Yearly plans don’t support mid-cycle refunds, but you can turn off renewal.'
  },
  {
    q: 'How frequently is data updated?',
    a: 'New contacts are added weekly and ongoing clean-ups/verification are performed. You can flag outdated contacts via the “Report” button.'
  },
  {
    q: 'Can I get API access?',
    a: 'Enterprise plans can access curated, rate-limited endpoints—for CRM sync, lead routing, or compliance audits. Requires approval and terms.'
  },
  {
    q: 'What about privacy and misuse prevention?',
    a: 'Contacts are for genuine business use only. Bulk scraping and spam are prohibited. Rate limits and activity monitoring help prevent abuse.'
  }
];

const FAQSection: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <Section id="faq">
      <Container>
        <Title>Frequently Asked Questions</Title>
        <Sub>
          A verified lender, banker & sales directory — clear pricing, transparent policies, and fast support.
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
                    rowRefs.current[i]!.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
                          backgroundColor: expanded ? alpha('#2563eb', 0.12) : alpha('#0f172a', 0.06)
                        }}
                      >
                        <AddRoundedIcon
                          sx={{ color: expanded ? '#2563eb' : '#0f172a', fontSize: 16 }} // was 18
                        />
                      </IconWrap>
                    </IconButton>
                  }
                  sx={{
                    backgroundColor: expanded ? alpha('#2563eb', 0.04) : '#fff'
                  }}
                >
                  <Typography sx={{ fontSize: 15.5 }}>{it.q}</Typography>
                </Row>

                <Collapse in={expanded} timeout={200} unmountOnExit>
                  <Divider sx={{ mx: 2, my: 1, borderColor: alpha('#0f172a', 0.08) }} />
                  <Body>
                    <Typography sx={{ fontSize: 14.5, lineHeight: 1.55 }}>{it.a}</Typography>
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
