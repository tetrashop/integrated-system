#!/usr/bin/env python3
"""
آمان راز - سیستم خوشه‌ای همسطح
Aman Secret - Peer-to-Peer Cluster Management
"""

import asyncio
import aiohttp
from typing import List, Dict, Any
import hashlib
import json
from datetime import datetime

class SecretClusterNode:
    def __init__(self, node_id: str, power_level: float):
        self.node_id = node_id
        self.power_level = power_level
        self.peers = []
        self.secrets = {}
        self.is_active = True
    
    def synchronize_with_peers(self, peers: List['SecretClusterNode']):
        """همگام‌سازی با همنوعان همسطح"""
        self.peers = peers
        print(f"🔄 گره {self.node_id} با {len(peers)} گره همسطح همگام شد")
    
    def share_secret(self, secret_id: str, secret_data: Dict):
        """اشتراک‌گذاری راز با خوشه"""
        self.secrets[secret_id] = secret_data
        
        # انتشار در خوشه
        for peer in self.peers:
            if peer.is_active and peer.power_level >= self.power_level * 0.8:
                peer.receive_secret(secret_id, secret_data, self.node_id)
    
    def receive_secret(self, secret_id: str, secret_data: Dict, sender_id: str):
        """دریافت راز از گره همسطح"""
        if secret_id not in self.secrets:
            self.secrets[secret_id] = secret_data
            print(f"🔐 گره {self.node_id} راز {secret_id} را از {sender_id} دریافت کرد")

class QuantumSecretCluster:
    def __init__(self, cluster_id: str):
        self.cluster_id = cluster_id
        self.nodes = {}
        self.quantum_entanglement_level = 0.0
    
    def add_node(self, node: SecretClusterNode):
        """افزودن گره به خوشه"""
        self.nodes[node.node_id] = node
        self._update_cluster_entanglement()
    
    def _update_cluster_entanglement(self):
        """به‌روزرسانی سطح درهمتنیدگی کوانتومی خوشه"""
        total_power = sum(node.power_level for node in self.nodes.values())
        avg_power = total_power / len(self.nodes) if self.nodes else 0
        
        # محاسبه درهمتنیدگی بر اساس همسانی سطح قدرت
        power_variance = sum((node.power_level - avg_power) ** 2 for node in self.nodes.values())
        power_variance = power_variance / len(self.nodes) if self.nodes else 0
        
        self.quantum_entanglement_level = 1.0 / (1.0 + power_variance)
    
    def synchronize_cluster(self):
        """همگام‌سازی کامل خوشه"""
        node_list = list(self.nodes.values())
        
        for node in node_list:
            # فیلتر گره‌های همسطح (حداکثر ۲۰٪ اختلاف قدرت)
            peers = [peer for peer in node_list 
                    if peer.node_id != node.node_id 
                    and abs(peer.power_level - node.power_level) <= node.power_level * 0.2]
            
            node.synchronize_with_peers(peers)
        
        print(f"🎯 خوشه {self.cluster_id} با {len(node_list)} گره همسطح همگام شد")
        print(f"⚡ سطح درهمتنیدگی کوانتومی: {self.quantum_entanglement_level:.3f}")
    
    def broadcast_secret(self, secret_id: str, secret_data: Dict, origin_node_id: str):
        """پخش راز در سراسر خوشه"""
        if origin_node_id in self.nodes:
            self.nodes[origin_node_id].share_secret(secret_id, secret_data)
    
    def get_cluster_health(self) -> Dict[str, Any]:
        """دریافت وضعیت سلامت خوشه"""
        active_nodes = sum(1 for node in self.nodes.values() if node.is_active)
        total_secrets = sum(len(node.secrets) for node in self.nodes.values())
        
        return {
            'cluster_id': self.cluster_id,
            'total_nodes': len(self.nodes),
            'active_nodes': active_nodes,
            'quantum_entanglement': self.quantum_entanglement_level,
            'total_secrets': total_secrets,
            'average_power': sum(node.power_level for node in self.nodes.values()) / len(self.nodes) if self.nodes else 0,
            'synchronization_level': self._calculate_sync_level()
        }
    
    def _calculate_sync_level(self) -> float:
        """محاسبه سطح همگام‌سازی خوشه"""
        if not self.nodes:
            return 0.0
        
        sync_scores = []
        for node in self.nodes.values():
            peer_sync = len([p for p in node.peers if p.is_active]) / len(self.nodes) if self.nodes else 0
            sync_scores.append(peer_sync)
        
        return sum(sync_scores) / len(sync_scores)

# نمونه استفاده
async def main():
    print("🔮 سیستم آمان راز - خوشه همسطح کوانتومی")
    
    # ایجاد خوشه
    cluster = QuantumSecretCluster("quantum-secret-cluster-1")
    
    # ایجاد گره‌های همسطح
    nodes = [
        SecretClusterNode("node-alpha", 0.95),
        SecretClusterNode("node-beta", 0.92),
        SecretClusterNode("node-gamma", 0.89),
        SecretClusterNode("node-delta", 0.94)
    ]
    
    # افزودن گره‌ها به خوشه
    for node in nodes:
        cluster.add_node(node)
    
    # همگام‌سازی خوشه
    cluster.synchronize_cluster()
    
    # اشتراک‌گذاری راز
    secret_data = {
        'content': 'راز کوانتومی مهم',
        'timestamp': datetime.now().isoformat(),
        'security_level': 'ULTRA_QUANTUM'
    }
    
    cluster.broadcast_secret("quantum-secret-001", secret_data, "node-alpha")
    
    # نمایش وضعیت خوشه
    health = cluster.get_cluster_health()
    print("\n📊 وضعیت سلامت خوشه:")
    for key, value in health.items():
        print(f"  {key}: {value}")

if __name__ == "__main__":
    asyncio.run(main())
