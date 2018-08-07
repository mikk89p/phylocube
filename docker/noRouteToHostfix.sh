#!/usr/bin/env bash
systemctl stop firewalld
systemctl disable firewalld
iptables --policy INPUT ACCEPT
iptables --policy OUTPUT ACCEPT
iptables --policy FORWARD ACCEPT
iptables -Z
iptables -F
iptables -X
systemctl restart docker
exit 0