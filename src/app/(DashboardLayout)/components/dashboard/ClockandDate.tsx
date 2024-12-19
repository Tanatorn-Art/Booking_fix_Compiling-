// DateTimeCard.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Card = styled.div`
  width: 363px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  background-color: white;
  margin: 2.8px auto;
  text-align: center;
  font-family: 'Sarabun', sans-serif;
`;

const DateText = styled.div`
  font-size: 1.2em;
  color: #333;
  margin-bottom: 10px;
`;

const TimeText = styled.div`
  font-size: 2em;
  color: #007bff;
  font-weight: bold;
`;

const DateTimeCard: React.FC = () => {
  const [dateTime, setDateTime] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('th-TH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('th-TH');
  };

  return (
    <Card>
      <DateText>{formatDate(dateTime)}</DateText>
      <TimeText>{formatTime(dateTime)}</TimeText>
    </Card>
  );
};

export default DateTimeCard;