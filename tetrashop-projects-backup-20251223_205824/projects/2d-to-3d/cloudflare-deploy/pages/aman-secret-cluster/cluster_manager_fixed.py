#!/usr/bin/env python3
"""
آمان راز - نسخه تعمیر شده با امنیت و اجماع
"""

import hashlib
import json
import time
from typing import List, Dict, Any
from dataclasses import dataclass
from cryptography.fernet import Fernet

@dataclass
class QuantumSecret:
    id: str
    content: str
    security_level: str
    timestamp: float
    owner: str
    signature: str = ""

class SecureClusterNode:
    def __init__(self, node_id: str, power_level: float):
        self.node_id = node_id
        self.power_level = power_level
        self.peers: List['SecureClusterNode'] = []
        self.secrets: Dict[str, QuantumSecret] = {}
        self.encryption_key = Fernet.generate_key()
        self.cipher_suite = Fernet(self.encryption_key)
        self.consensus_threshold = 0.6
        
    def encrypt_secret(self, secret_data: Dict) -> str:
        """رمزنگاری راز"""
        json_data = json.dumps(secret_data, ensure_ascii=False)
        encrypted_data = self.cipher_suite.encrypt(json_data.encode())
        return encrypted_data.decode('latin-1')
    
    def decrypt_secret(self, encrypted_data: str) -> Dict:
        """رمزگشایی راز"""
        try:
            decrypted_data = self.cipher_suite.decrypt(encrypted_data.encode('latin-1'))
            return json.loads(decrypted_data.decode())
        except Exception as e:
            print(f"❌ خطا در رمزگشایی: {e}")
            return {}
    
    def create_quantum_secret(self, content: str, security_level: str = "HIGH") -> QuantumSecret:
        """ایجاد راز کوانتومی جدید"""
        secret_id = hashlib.sha256(f"{content}{time.time()}".encode()).hexdigest()[:16]
        timestamp = time.time()
        
        secret_data = {
            'content': content,
            'security_level': security_level,
            'timestamp': timestamp,
            'owner': self.node_id
        }
        
        encrypted_content = self.encrypt_secret(secret_data)
        signature = self._create_signature(encrypted_content)
        
        return QuantumSecret(
            id=secret_id,
            content=encrypted_content,
            security_level=security_level,
            timestamp=timestamp,
            owner=self.node_id,
            signature=signature
        )
    
    def _create_signature(self, data: str) -> str:
        """ایجاد امضا دیجیتال"""
        return hashlib.sha256(f"{data}{self.node_id}".encode()).hexdigest()
    
    def verify_secret(self, secret: QuantumSecret) -> bool:
        """اعتبارسنجی راز"""
        try:
            # بررسی امضا
            expected_signature = self._create_signature(secret.content)
            if secret.signature != expected_signature:
                return False
            
            # بررسی timestamp
            if time.time() - secret.timestamp > 24 * 60 * 60:  # 24 ساعت
                return False
                
            return True
        except:
            return False
    
    def share_secret_with_consensus(self, secret: QuantumSecret, peers: List['SecureClusterNode']) -> bool:
        """اشتراک‌گذاری راز با مکانیزم اجماع"""
        if not self.verify_secret(secret):
            print("❌ راز معتبر نیست")
            return False
        
        # شبیه‌سازی اجماع
        approvals = 0
        total_peers = len(peers)
        
        for peer in peers:
            if self._simulate_peer_approval(peer, secret):
                approvals += 1
        
        consensus_achieved = approvals / total_peers >= self.consensus_threshold
        
        if consensus_achieved:
            # انتشار راز در خوشه
            for peer in peers:
                peer.receive_verified_secret(secret)
            print(f"✅ راز {secret.id} با اجماع {approvals}/{total_peers} منتشر شد")
            return True
        else:
            print(f"❌ اجماع برای راز {secret.id} حاصل نشد ({approvals}/{total_peers})")
            return False
    
    def _simulate_peer_approval(self, peer: 'SecureClusterNode', secret: QuantumSecret) -> bool:
        """شبیه‌سازی تأیید همتایان"""
        # در نسخه واقعی، اینجا پیام‌رسانی واقعی انجام شود
        return peer.power_level >= self.power_level * 0.8
    
    def receive_verified_secret(self, secret: QuantumSecret):
        """دریافت راز تأیید شده"""
        if secret.id not in self.secrets and self.verify_secret(secret):
            self.secrets[secret.id] = secret
            print(f"🔐 گره {self.node_id} راز {secret.id} را دریافت کرد")

class AdvancedQuantumCluster:
    def __init__(self, cluster_id: str):
        self.cluster_id = cluster_id
        self.nodes: Dict[str, SecureClusterNode] = {}
        self.quantum_entanglement = 0.0
        self.consensus_history = []
    
    def add_node(self, node: SecureClusterNode):
        """افزودن گره به خوشه"""
        self.nodes[node.node_id] = node
        self._update_quantum_entanglement()
    
    def _update_quantum_entanglement(self):
        """به‌روزرسانی درهمتنیدگی کوانتومی"""
        if len(self.nodes) < 2:
            self.quantum_entanglement = 0.0
            return
        
        power_levels = [node.power_level for node in self.nodes.values()]
        avg_power = sum(power_levels) / len(power_levels)
        
        # محاسبه همگنی قدرت
        variance = sum((p - avg_power) ** 2 for p in power_levels) / len(power_levels)
        self.quantum_entanglement = 1.0 / (1.0 + variance * 10)
    
    def establish_secure_connections(self):
        """برقراری اتصالات امن بین گره‌ها"""
        node_list = list(self.nodes.values())
        
        for node in node_list:
            # اتصال به گره‌های همسطح
            peers = [peer for peer in node_list 
                    if peer.node_id != node.node_id 
                    and abs(peer.power_level - node.power_level) <= node.power_level * 0.2]
            
            node.peers = peers
        
        print(f"🔗 اتصالات امن در خوشه {self.cluster_id} برقرار شد")
    
    def broadcast_quantum_secret(self, origin_node_id: str, content: str, security_level: str = "HIGH") -> bool:
        """پخش راز کوانتومی در خوشه"""
        if origin_node_id not in self.nodes:
            print(f"❌ گره مبدأ {origin_node_id} یافت نشد")
            return False
        
        origin_node = self.nodes[origin_node_id]
        secret = origin_node.create_quantum_secret(content, security_level)
        
        success = origin_node.share_secret_with_consensus(secret, origin_node.peers)
        
        # ثبت در تاریخچه اجماع
        self.consensus_history.append({
            'secret_id': secret.id,
            'origin': origin_node_id,
            'timestamp': time.time(),
            'success': success,
            'content_preview': content[:50] + "..."
        })
        
        return success
    
    def get_cluster_security_report(self) -> Dict[str, Any]:
        """گزارش امنیتی خوشه"""
        total_secrets = sum(len(node.secrets) for node in self.nodes.values())
        active_nodes = sum(1 for node in self.nodes.values() if node.peers)
        
        successful_consensus = sum(1 for record in self.consensus_history if record['success'])
        consensus_rate = successful_consensus / len(self.consensus_history) if self.consensus_history else 0.0
        
        return {
            'cluster_id': self.cluster_id,
            'total_nodes': len(self.nodes),
            'active_nodes': active_nodes,
            'quantum_entanglement': self.quantum_entanglement,
            'total_secrets': total_secrets,
            'consensus_success_rate': consensus_rate,
            'average_power': sum(node.power_level for node in self.nodes.values()) / len(self.nodes) if self.nodes else 0,
            'security_level': self._calculate_overall_security()
        }
    
    def _calculate_overall_security(self) -> str:
        """محاسبه سطح کلی امنیت"""
        if self.quantum_entanglement > 0.8 and len(self.nodes) >= 3:
            return "VERY_HIGH"
        elif self.quantum_entanglement > 0.6:
            return "HIGH"
        elif self.quantum_entanglement > 0.4:
            return "MEDIUM"
        else:
            return "LOW"

# تست سیستم
def test_advanced_cluster():
    print("🔮 آمان راز - نسخه تعمیر شده با امنیت پیشرفته")
    
    # ایجاد خوشه
    cluster = AdvancedQuantumCluster("secure-quantum-cluster")
    
    # ایجاد گره‌های امن
    nodes = [
        SecureClusterNode("secure-alpha", 0.95),
        SecureClusterNode("secure-beta", 0.92),
        SecureClusterNode("secure-gamma", 0.93),
        SecureClusterNode("secure-delta", 0.91)
    ]
    
    # افزودن گره‌ها
    for node in nodes:
        cluster.add_node(node)
    
    # برقراری اتصالات
    cluster.establish_secure_connections()
    
    # پخش راز امن
    print("\n🔐 آزمایش پخش راز امن:")
    success = cluster.broadcast_quantum_secret("secure-alpha", "این یک راز کوانتومی بسیار مهم است", "ULTRA_HIGH")
    
    # نمایش گزارش
    print("\n📊 گزارش امنیتی خوشه:")
    report = cluster.get_cluster_security_report()
    for key, value in report.items():
        print(f"  {key}: {value}")

if __name__ == "__main__":
    test_advanced_cluster()
